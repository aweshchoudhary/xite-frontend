"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { UpdateSchema } from "./schema";
import { revalidatePath } from "next/cache";

export type UpdateActionResponse = {
  data: PrimaryDB.CohortIndustryExpertsSectionGetPayload<object>;
};

export type UpdateActionProps = {
  data: UpdateSchema;
};

export const updateAction = async ({
  data,
}: UpdateActionProps): Promise<UpdateActionResponse> => {
  try {
    const { id, ...rest } = data;

    const upsertedData = await primaryDB.cohortIndustryExpertsSection.update({
      where: {
        id,
      },
      data: {
        ...rest,
      },
    });

    revalidatePath("/cohort-content");

    return { data: upsertedData };
  } catch (error) {
    throw error;
  }
};
