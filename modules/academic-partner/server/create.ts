import { PrimaryDB } from "@/modules/common/database/prisma";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { revalidatePath } from "next/cache";
import { MODULE_NAME, MODULE_PATH } from "../contants";
import { getLoggedInUser } from "@/modules/user/utils";

export type CreateOneOutput = PrimaryDB.AcademicPartnerGetPayload<object>;

export async function createOne(
  data: PrimaryDB.AcademicPartnerCreateInput
): Promise<CreateOneOutput> {
  try {
    const user = await getLoggedInUser();
    const newData = await primaryDB.academicPartner.create({
      data: {
        ...data,
        updated_by: {
          connect: {
            id: user.id,
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
