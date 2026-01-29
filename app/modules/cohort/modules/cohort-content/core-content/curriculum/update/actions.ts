"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { UpdateSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { getLoggedInUser } from "@/modules/user/utils";
import { logUpdate } from "@/modules/common/lib/audit-logger";
import { getAuthUser } from "@/modules/common/authentication/firebase/action";

export type UpdateActionResponse = {
  data: PrimaryDB.DesignCohortCurriculumSectionGetPayload<{
    include: {
      items: true;
    };
  }>;
};

export type UpdateActionProps = {
  data: UpdateSchema;
};

export const updateAction = async ({
  data,
}: UpdateActionProps): Promise<UpdateActionResponse> => {
  try {
    const { cohort_id, items, ...rest } = data;
    const currentUser = await getLoggedInUser();

    const upsertedData = await primaryDB.designCohortCurriculumSection.create({
      data: {
        ...rest,
        cohort: {
          connect: {
            id: cohort_id,
          },
        },
        updated_by: {
          connect: {
            id: currentUser?.dbUser?.id,
          },
        },
      },
      include: {
        items: true,
      },
    });

    // Create section items with their objectives
    for (const item of items) {
      const createdItem =
        await primaryDB.designCohortCurriculumSectionItem.create({
          data: {
            position: item.position,
            title: item.title,
            overview: item.overview,
            parent_section_id: upsertedData.id,
            updated_by_id: currentUser?.dbUser?.id,
          },
        });

      // Create objectives for this item
      if (item.objectives && item.objectives.length > 0) {
        const validObjectives = item.objectives.filter(
          (objective) => objective.description,
        );
        if (validObjectives.length > 0) {
          await primaryDB.designCohortCurriculumObjective.createMany({
            data: validObjectives.map((objective) => ({
              position: objective.position,
              description: objective.description!,
              parent_section_id: createdItem.id,
              updated_by_id: currentUser?.dbUser?.id,
            })),
          });
        }
      }

      for (const session of item.sessions) {
        const createdSession =
          await primaryDB.designCohortCurriculumSession.create({
            data: {
              position: session.position,
              title: session.title,
              overview: session.overview,
              parent_section_id: createdItem.id,
              sub_topic_id: session.sub_topic_id || null,
              updated_by_id: currentUser?.dbUser?.id,
            },
          });

        // Create objectives for this session
        if (session.objectives && session.objectives.length > 0) {
          const validObjectives = session.objectives.filter(
            (objective) => objective.description,
          );
          if (validObjectives.length > 0) {
            await primaryDB.designCohortCurriculumObjective.createMany({
              data: validObjectives.map((objective) => ({
                position: objective.position,
                description: objective.description!,
                designCohortCurriculumSessionId: createdSession.id,
                updated_by_id: currentUser?.dbUser?.id,
              })),
            });
          }
        }
      }
    }

    try {
      const user = await getAuthUser();
      if (user) {
        await logUpdate(
          user.uid,
          user.name || user.email || "Unknown User",
          "DesignCohortCurriculumSection",
          upsertedData.id,
          upsertedData.title ?? cohort_id,
          "postgresql",
          undefined,
          upsertedData,
          { cohort_id },
        );
      }
    } catch (auditError) {
      console.error("Failed to create audit log:", auditError);
    }

    revalidatePath("/cohorts");

    return { data: upsertedData };
  } catch (error) {
    throw error;
  }
};
