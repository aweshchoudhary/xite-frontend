"use server";
import {
  updateOne,
  UpdateOneOutput,
} from "@/modules/academic-partner/server/update";
import { UpdateSchema } from "../schema";
import { revalidatePath } from "next/cache";
import { MODULE_NAME, MODULE_PATH } from "@/modules/academic-partner/contants";
import { uploadFile } from "@/modules/common/services/file-upload";

type UpdateActionOutput = {
  error?: string;
  data?: UpdateOneOutput;
};

export async function updateAction(
  data: UpdateSchema,
  id: string
): Promise<UpdateActionOutput> {
  try {
    const {
      logo_file,
      logo_url: old_logo_url,
      logo_file_action,
      ...rest
    } = data;

    let logo_url = old_logo_url;

    if (logo_file && logo_file_action === "upload") {
      logo_url = (await uploadFile(logo_file)).fileUrl;
    } else if (logo_file_action === "delete") {
      logo_url = null; // Remove the logo
    }

    const updatedData = await updateOne({
      id,
      data: {
        ...rest,
        logo_url,
      },
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
