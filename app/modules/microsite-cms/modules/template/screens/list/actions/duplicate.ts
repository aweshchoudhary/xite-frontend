"use server";
import { duplicateTemplate } from "@microsite-cms/common/services/db";
import { revalidatePath } from "next/cache";

export async function duplicateTemplateAction(id: string) {
  try {
    const duplicated = await duplicateTemplate(id);
    revalidatePath("/templates");
    return duplicated;
  } catch (error) {
    throw error;
  }
}
