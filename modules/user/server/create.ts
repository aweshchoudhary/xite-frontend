import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { revalidatePath } from "next/cache";
import { MODULE_NAME, MODULE_PATH } from "../contants";

export type CreateOneOutput = PrimaryDB.UserGetPayload<object>;

export async function createOne(
  data: PrimaryDB.UserCreateInput
): Promise<CreateOneOutput> {
  try {
    const newData = await primaryDB.user.create({
      data,
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
