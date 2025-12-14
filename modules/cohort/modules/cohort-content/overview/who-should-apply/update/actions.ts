"use server";
import { primaryDB, PrimaryDB } from "@/modules/common/database";
import { UpdateSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { getLoggedInUser } from "@/modules/user/utils";

export type UpdateActionResponse = {
  data: PrimaryDB.CohortWhoShouldApplySectionGetPayload<object>;
};

export type UpdateActionProps = {
  data: UpdateSchema;
};

export const updateAction = async ({
  data,
}: UpdateActionProps): Promise<UpdateActionResponse> => {
  try {
    const { cohort_id, ...rest } = data;
    const currentUser = await getLoggedInUser();
    const upsertedData = await primaryDB.cohortWhoShouldApplySection.create({
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
    });

    revalidatePath("/cohorts");

    return { data: upsertedData };
  } catch (error) {
    throw error;
  }
};
