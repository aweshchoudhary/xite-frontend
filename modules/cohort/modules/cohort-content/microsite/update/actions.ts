"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";

import { UpdateSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { getLoggedInUser } from "@/modules/user/utils";

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

    const upsertedData = await primaryDB.cohort.update({
      where: {
        id: cohort_id,
      },
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
            id: currentUser.id,
          },
        },
      },
    });

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
      })
    );
  } catch (error) {
    throw error;
  }
};
