"use server";
import { upload } from "./connection";

export async function uploadFileAction(file: File) {
  const { fileUrl } = await upload({ file });
  return fileUrl;
}
