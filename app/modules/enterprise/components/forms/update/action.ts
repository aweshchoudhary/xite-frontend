"use server";
import { updateRecord, UpdateRecordOutput } from "@/modules/common/database/controllers/enterprise/update";
import { UpdateSchema } from "../schema";
import { revalidatePath } from "next/cache";
import { MODULE_NAME, MODULE_PATH } from "@/modules/enterprise/contants";

type UpdateActionOutput = {
  error?: string;
  data?: UpdateRecordOutput;
};

export async function updateAction(
  data: UpdateSchema,
  id: string
): Promise<UpdateActionOutput> {
  try {
    const updatedData = await updateRecord({
      recordId: id,
      data,
    });

    if (!updatedData) {
      throw new Error(`Failed to update ${MODULE_NAME}`);
    }

    revalidatePath(MODULE_PATH);

    return { data: updatedData };
  } catch (error) {
    console.error(error);
    return { error: `Failed to update ${MODULE_NAME}` };
  }
}
