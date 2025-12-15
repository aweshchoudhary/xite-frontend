"use server";
import { getTemplatesByCohortId } from "@/modules/microsite-cms/modules/common/services/db";

export async function getTemplatesByCohortIdAction(cohortId: string) {
  try {
    const templates = await getTemplatesByCohortId(cohortId);
    return templates;
  } catch (error) {
    throw error;
  }
}
