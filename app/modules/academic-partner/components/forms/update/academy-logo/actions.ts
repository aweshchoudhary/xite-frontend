"use server";

import { uploadFile } from "@/modules/common/services/file-upload";
import { updateRecord } from "@/modules/common/database/controllers/academic-partner/update";
import { revalidatePath } from "next/cache";

export async function updateAcademyLogo(academyId: string, image: File) {
  try {
    const { fileUrl } = await uploadFile(image);

    const updatedData = await updateRecord({
      recordId: academyId,
      data: { logo_url: fileUrl },
    });

    if (!updatedData) {
      throw new Error("Failed to update academy logo");
    }

    revalidatePath(`/academic-partner`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
