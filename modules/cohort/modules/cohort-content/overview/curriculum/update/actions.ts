"use server";
import { primaryDB, PrimaryDB } from "@/modules/common/database";
import { UpdateSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { getLoggedInUser } from "@/modules/user/utils";

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
            id: currentUser.id,
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
            updated_by_id: currentUser.id,
          },
        });

      // Create objectives for this item
      if (item.objectives && item.objectives.length > 0) {
        const validObjectives = item.objectives.filter(
          (objective) => objective.description
        );
        if (validObjectives.length > 0) {
          await primaryDB.designCohortCurriculumObjective.createMany({
            data: validObjectives.map((objective) => ({
              position: objective.position,
              description: objective.description!,
              parent_section_id: createdItem.id,
              updated_by_id: currentUser.id,
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
              updated_by_id: currentUser.id,
            },
          });

        // Create objectives for this session
        if (session.objectives && session.objectives.length > 0) {
          const validObjectives = session.objectives.filter(
            (objective) => objective.description
          );
          if (validObjectives.length > 0) {
            await primaryDB.designCohortCurriculumObjective.createMany({
              data: validObjectives.map((objective) => ({
                position: objective.position,
                description: objective.description!,
                designCohortCurriculumSessionId: createdSession.id,
                updated_by_id: currentUser.id,
              })),
            });
          }
        }
      }
    }

    revalidatePath("/cohorts");

    return { data: upsertedData };
  } catch (error) {
    throw error;
  }
};
