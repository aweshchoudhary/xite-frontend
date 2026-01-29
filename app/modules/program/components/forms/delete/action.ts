"use server";
import { MODULE_PATH } from "@/modules/program/contants";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { revalidatePath } from "next/cache";
import { requireAccess } from "@/modules/common/authentication/access-control/middleware/check-access";

export async function deleteOneAction(programId: string) {
  try {
    await requireAccess("delete", "Program");

    const deletedData = await primaryDB.program.delete({
      where: { id: programId },
    });

    revalidatePath(MODULE_PATH);

    return deletedData;
  } catch (error) {
    throw error;
  }
}
