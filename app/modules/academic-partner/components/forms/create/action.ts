"use server";
import {
  createOne,
  CreateOneOutput,
} from "@/modules/academic-partner/server/create";
import { CreateSchema } from "../schema";
import { revalidatePath } from "next/cache";
import { MODULE_NAME, MODULE_PATH } from "@/modules/academic-partner/contants";
import { uploadFile } from "@/modules/common/services/file-upload";

type CreateActionOutput = {
  error?: string;
  data?: CreateOneOutput;
};

export async function createAction(
  data: CreateSchema
): Promise<CreateActionOutput> {
  try {
    const { logo_file, ...rest } = data;
    let logo_url = null;

    if (logo_file) {
      logo_url = (await uploadFile(logo_file)).fileUrl;
    }

    const createdData = await createOne({
      ...rest,
      logo_url,
    });

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
