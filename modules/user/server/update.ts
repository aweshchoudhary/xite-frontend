import { PrimaryDB, primaryDB } from "@/modules/common/database";
import { MODULE_PATH } from "../contants";
import { revalidatePath } from "next/cache";

export type UpdateOneOutput = PrimaryDB.UserGetPayload<object>;

export async function updateOne({
  id,
  data,
}: {
  id: string;
  data: PrimaryDB.UserUpdateInput;
}) {
  try {
    const updatedData = await primaryDB.user.update({
      where: { id },
      data,
    });

    revalidatePath(MODULE_PATH);

    return updatedData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
