"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { UpdateSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { getLoggedInUser } from "@/modules/user/utils";

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
    const currentUser = await getLoggedInUser();
    const updatedData = await primaryDB.cohortIndustryExpertsSection.update({
      where: { id },
      data: {
        ...rest,
        updated_by: { connect: { id: currentUser.id } },
      },
    });

    revalidatePath("/cohorts");

    return { data: updatedData };
  } catch (error) {
    throw error;
  }
};
