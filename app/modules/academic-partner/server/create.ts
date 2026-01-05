import { primaryDB } from "@/modules/common/database/prisma/connection";
import { revalidatePath } from "next/cache";
import { MODULE_NAME, MODULE_PATH } from "../contants";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { getUser } from "@/modules/common/authentication/firebase/action";

export type CreateOneOutput = PrimaryDB.AcademicPartnerGetPayload<object>;

export async function createOne(
  data: PrimaryDB.AcademicPartnerCreateInput
): Promise<CreateOneOutput> {
  try {
    const session = await getUser();
    const newData = await primaryDB.academicPartner.create({
      data: {
        ...data,
        updated_by: {
          connect: {
            id: session?.dbUser?.id,
          },
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
