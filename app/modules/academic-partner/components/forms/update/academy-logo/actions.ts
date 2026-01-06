"use server";

import { uploadFile } from "@/modules/common/services/file-upload";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { revalidatePath } from "next/cache";

export async function updateAcademyLogo(academyId: string, image: File) {
  try {
    const { fileUrl } = await uploadFile(image);

    const updatedData = await primaryDB.academicPartner.update({
      where: { id: academyId },
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
