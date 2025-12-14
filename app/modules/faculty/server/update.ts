"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { MODULE_PATH } from "../contants";
import { revalidatePath } from "next/cache";
import { getLoggedInUser } from "@/modules/user/utils";

export type UpdateOneOutput = PrimaryDB.FacultyGetPayload<object>;

export async function updateOne({
  id,
  data,
}: {
  id: string;
  data: PrimaryDB.FacultyUpdateInput;
}) {
  try {
    const user = await getLoggedInUser();
    const updatedData = await primaryDB.faculty.update({
      where: { id },
      data: {
        ...data,
        updated_by: {
          connect: {
            id: user.dbUser?.id,
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
