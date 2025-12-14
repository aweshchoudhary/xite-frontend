"use server";
import { primaryDB, PrimaryDB } from "@/modules/common/database";
import { UpdateSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { getLoggedInUser } from "@/modules/user/utils";

export type UpdateActionResponse = {
  data: PrimaryDB.CohortFacultySectionGetPayload<object>;
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
    const upsertedData = await primaryDB.cohortFacultySection.update({
      where: {
        id,
      },
      data: {
        ...rest,
        updated_by: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    revalidatePath("/cohort-content");

    return { data: upsertedData };
  } catch (error) {
    throw error;
  }
};
