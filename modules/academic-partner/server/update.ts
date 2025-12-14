import { PrimaryDB, primaryDB } from "@/modules/common/database";
import { MODULE_PATH } from "../contants";
import { revalidatePath } from "next/cache";
import { getLoggedInUser } from "@/modules/user/utils";

export type UpdateOneOutput = PrimaryDB.AcademicPartnerGetPayload<object>;

export async function updateOne({
  id,
  data,
}: {
  id: string;
  data: PrimaryDB.AcademicPartnerUpdateInput;
}) {
  try {
    const user = await getLoggedInUser();
    const updatedData = await primaryDB.academicPartner.update({
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
