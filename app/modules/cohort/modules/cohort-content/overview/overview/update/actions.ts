"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { UpdateSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { getLoggedInUser } from "@/modules/user/utils";

export type UpdateActionResponse = {
  data: PrimaryDB.CohortOverviewSectionGetPayload<object>;
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
    const upsertedData = await primaryDB.cohortOverviewSection.create({
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
    });

    revalidatePath("/cohorts");

    return { data: upsertedData };
  } catch (error) {
    throw error;
  }
};
