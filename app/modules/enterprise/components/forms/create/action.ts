"use server";
import { createRecord, CreateRecordOutput } from "@/modules/common/database/controllers/enterprise/create";
import { CreateSchema } from "../schema";
import { revalidatePath } from "next/cache";
import { MODULE_NAME, MODULE_PATH } from "@/modules/enterprise/contants";

type CreateActionOutput = {
  error?: string;
  data?: CreateRecordOutput;
};

export async function createAction(
  data: CreateSchema
): Promise<CreateActionOutput> {
  try {
    const createdData = await createRecord(data);

    if (!createdData) {
      throw new Error(`Failed to create ${MODULE_NAME}`);
    }

    revalidatePath(MODULE_PATH);

    return { data: createdData };
  } catch (error) {
    console.error(error);
    return { error: `Failed to create ${MODULE_NAME}` };
  }
}
