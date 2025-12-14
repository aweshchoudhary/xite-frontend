"use server";

import { upload } from "../file-system/connection";

export async function uploadFile(
  file: File
): Promise<{ filename: string; fileUrl: string }> {
  try {
    if (!file) {
      throw new Error("No file uploaded");
    }

    const { filename, fileUrl } = await upload({ file });

    if (!filename) {
      throw new Error("Failed to upload file");
    }

    return { filename, fileUrl };
  } catch (error) {
    throw error;
  }
}
