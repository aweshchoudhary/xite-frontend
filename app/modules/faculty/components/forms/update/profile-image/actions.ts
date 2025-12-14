"use server";

import { uploadFile } from "@/modules/common/services/file-upload";
import { MODULE_PATH } from "@/modules/faculty/contants";
import { updateOne } from "@/modules/faculty/server/update";
import { revalidatePath } from "next/cache";

export async function updateProfileImage(facultyId: string, banner: File) {
  try {
    const profile_image = await uploadFile(banner);

    if (!profile_image) {
      throw new Error("Failed to upload profile image");
    }

    const updatedData = await updateOne({
      id: facultyId,
      data: { profile_image: profile_image.fileUrl },
    });

    if (!updatedData) {
      throw new Error("Failed to update profile image");
    }

    revalidatePath(`${MODULE_PATH}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
