import { PrimaryDB, primaryDB } from "@/modules/common/database";
import { MODULE_PATH } from "../contants";
import { revalidatePath } from "next/cache";
import { getLoggedInUser } from "@/modules/user/utils";

export type UpdateOneOutput = PrimaryDB.EnterpriseGetPayload<object>;

export async function updateOne({
  id,
  data,
}: {
  id: string;
  data: PrimaryDB.EnterpriseUpdateInput;
}) {
  try {
    const user = await getLoggedInUser();
    const updatedData = await primaryDB.enterprise.update({
      where: { id },
      data: {
        ...data,
        updated_by: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    revalidatePath(MODULE_PATH);

    return updatedData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
