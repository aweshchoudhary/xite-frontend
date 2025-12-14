"use server";
import { MODULE_PATH } from "@/modules/program/contants";
import { deleteOne } from "@/modules/program/server/delete";
import { revalidatePath } from "next/cache";

export async function deleteOneAction(programId: string) {
  try {
    const deletedData = await deleteOne({ id: programId });

    revalidatePath(MODULE_PATH);

    return deletedData;
  } catch (error) {
    throw error;
  }
}
