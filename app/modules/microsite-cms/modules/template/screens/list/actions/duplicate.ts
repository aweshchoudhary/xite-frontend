"use server";
import { TemplateType } from "@/modules/common/database/mongodb/types/interfaces";
import { duplicateTemplate } from "@/modules/common/database/mongodb";
import { revalidatePath } from "next/cache";

export async function duplicateTemplateAction(
  id: string,
  cohortId?: string,
  type?: TemplateType,
) {
  try {
    const duplicated = await duplicateTemplate(id, cohortId);
    revalidatePath("/cms?tab=templates");
    return duplicated;
  } catch (error) {
    throw error;
  }
}
