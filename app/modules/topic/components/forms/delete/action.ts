"use server";
import { MODULE_NAME, MODULE_PATH } from "@/modules/topic/contants";
import {
  deleteOne,
  DeleteOneOutput,
} from "@/modules/topic/server/delete";
import { revalidatePath } from "next/cache";

type DeleteActionOutput = {
  error?: string;
  data?: DeleteOneOutput;
};

export async function deleteAction(id: string): Promise<DeleteActionOutput> {
  try {
    const deletedData = await deleteOne({ id });

    revalidatePath(MODULE_PATH);

    return { data: deletedData };
  } catch (error) {
    console.error(error);
    return { error: `Failed to delete ${MODULE_NAME}` };
  }
}


