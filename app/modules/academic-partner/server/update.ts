import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { MODULE_PATH } from "../contants";
import { revalidatePath } from "next/cache";
import { getUser } from "@/modules/common/authentication/firebase/action";
import { updateRecord } from "@/modules/common/database/controllers/academic-partner/update";

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
    const updatedData = await updateRecord({
      recordId: id,
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
