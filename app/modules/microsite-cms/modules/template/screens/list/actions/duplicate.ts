"use server";
import { TemplateType } from "@/modules/microsite-cms/modules/common/services/db/types/interfaces";
import { duplicateTemplate } from "@microsite-cms/common/services/db";
import { revalidatePath } from "next/cache";

export async function duplicateTemplateAction(
  id: string,
  cohortId?: string,
  type?: TemplateType
) {
  try {
    const duplicated = await duplicateTemplate(id, cohortId);
    revalidatePath("/cms?tab=templates");
    return duplicated;
  } catch (error) {
    throw error;
  }
}
