"use server";
import { MODULE_NAME, MODULE_PATH } from "@/modules/enterprise/contants";
import { deleteRecord, DeleteRecordOutput } from "@/modules/common/database/controllers/enterprise/delete";
import { revalidatePath } from "next/cache";

type DeleteActionOutput = {
  error?: string;
  data?: DeleteRecordOutput;
};

export async function deleteAction(id: string): Promise<DeleteActionOutput> {
  try {
    const deletedData = await deleteRecord({ recordId: id });

    revalidatePath(MODULE_PATH);

    return { data: deletedData };
  } catch (error) {
    console.error(error);
    return { error: `Failed to delete ${MODULE_NAME}` };
  }
}
