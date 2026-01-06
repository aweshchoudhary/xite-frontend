"use server";
import { MODULE_PATH } from "@/modules/program/contants";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { revalidatePath } from "next/cache";

export async function deleteOneAction(programId: string) {
  try {
    const deletedData = await primaryDB.program.delete({
      where: { id: programId },
    });

    revalidatePath(MODULE_PATH);

    return deletedData;
  } catch (error) {
    throw error;
  }
}
