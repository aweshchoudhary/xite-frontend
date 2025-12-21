"use server";
import { duplicateTemplate } from "@microsite-cms/common/services/db";
import { revalidatePath } from "next/cache";

export async function duplicateTemplateAction(
  id: string,
  cohortId?: string
) {
  try {
    const duplicated = await duplicateTemplate(id, cohortId);
    revalidatePath("/templates");
    return duplicated;
  } catch (error) {
    throw error;
  }
}
