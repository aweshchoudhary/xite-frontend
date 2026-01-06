"use server";
import { MODULE_PATH } from "@/modules/program/contants";
import { deleteRecord } from "@/modules/common/database/controllers/program/delete";
import { revalidatePath } from "next/cache";

export async function deleteOneAction(programId: string) {
  try {
    const deletedData = await deleteRecord({ recordId: programId });

    revalidatePath(MODULE_PATH);

    return deletedData;
  } catch (error) {
    throw error;
  }
}
