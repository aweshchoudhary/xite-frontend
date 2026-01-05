import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { MODULE_PATH } from "../contants";
import { revalidatePath } from "next/cache";
import { getUser } from "@/modules/common/authentication/firebase/action";

export type UpdateOneOutput = PrimaryDB.AcademicPartnerGetPayload<object>;

export async function updateOne({
  id,
  data,
}: {
  id: string;
  data: PrimaryDB.AcademicPartnerUpdateInput;
}) {
  try {
    const session = await getUser();
    const updatedData = await primaryDB.academicPartner.update({
      where: { id },
      data: {
        ...data,
        updated_by: {
          connect: {
            id: session?.dbUser?.id,
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
