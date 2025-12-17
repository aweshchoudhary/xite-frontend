"use server";
import { getTemplatesByCohortId } from "../../../common/services/db";

export async function getTemplatesByCohortIdAction(cohortId?: string) {
  const templates = await getTemplatesByCohortId(cohortId);
  return templates;
}
