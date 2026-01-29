"use server";
import { getTemplatesByCohortId } from "../../../../../common/database/mongodb";

export async function getTemplatesByCohortIdAction(cohortId?: string) {
  const templates = await getTemplatesByCohortId(cohortId);
  return templates;
}
