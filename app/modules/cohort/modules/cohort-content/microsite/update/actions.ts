"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { UpdateSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { getLoggedInUser } from "@/modules/user/utils";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { logUpdate } from "@/modules/common/lib/audit-logger";
import { getAuthUser } from "@/modules/common/authentication/firebase/action";

export type UpdateActionResponse = {
  data: PrimaryDB.CohortGetPayload<object>;
};

export type UpdateActionProps = {
  data: UpdateSchema;
};

export const updateAction = async ({
  data,
}: UpdateActionProps): Promise<UpdateActionResponse> => {
  try {
    const { cohort_id, sections, ...rest } = data;
    const currentUser = await getLoggedInUser();

    await updateSectionOrder({ sections, cohort_id });

    const initialCohort = await primaryDB.cohort.findUnique({
      where: { id: cohort_id },
      include: { microsite_section: true },
    });

    const upsertedData = await primaryDB.cohort.update({
      where: { id: cohort_id },
      data: {
        microsite_section: {
          update: {
            visibility_start_date: rest.visibility_start_date,
            visibility_end_date: rest.visibility_end_date,
            custom_domain: rest.custom_domain,
          },
        },
        updated_by: {
          connect: {
            id: currentUser?.dbUser?.id,
          },
        },
      },
    });

    try {
      const user = await getAuthUser();
      if (user) {
        await logUpdate(
          user.uid,
          user.name || user.email || "Unknown User",
          "Cohort",
          cohort_id,
          upsertedData.name ?? cohort_id,
          "postgresql",
          initialCohort,
          upsertedData,
          { action: "microsite_section", ...rest },
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

type UpdateSectionOrderProps = {
  sections: {
    id: string;
    section_position: number;
  }[];
  cohort_id: string;
};

const updateSectionOrder = async ({
  sections,
  cohort_id,
}: UpdateSectionOrderProps) => {
  try {
    await Promise.all(
      sections.map(async (section) => {
        await primaryDB.cohortSectionOrder.update({
          where: { id: section.id },
          data: { section_position: section.section_position },
        });
      }),
    );
  } catch (error) {
    throw error;
  }
};
