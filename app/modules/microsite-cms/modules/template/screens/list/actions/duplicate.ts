"use server";
import { duplicateTemplate } from "@/modules/microsite-cms/modules/common/services/db";
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
