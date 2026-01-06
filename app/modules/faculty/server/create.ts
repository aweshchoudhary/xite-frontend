import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { revalidatePath } from "next/cache";
import { MODULE_NAME, MODULE_PATH } from "../contants";
import { getLoggedInUser } from "@/modules/user/utils";
import { createRecord } from "@/modules/common/database/controllers/faculty/create";

export type CreateOneOutput = PrimaryDB.FacultyGetPayload<object>;

export async function createOne(
  data: PrimaryDB.FacultyCreateInput
): Promise<CreateOneOutput> {
  try {
    const user = await getLoggedInUser();
    const newData = await createRecord({
      ...data,
      updated_by: {
        connect: {
          id: user.dbUser?.id,
        },
      },
    });
    if (!newData) {
      throw new Error(`Failed to create ${MODULE_NAME}`);
    }

    revalidatePath(MODULE_PATH);

    return newData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
