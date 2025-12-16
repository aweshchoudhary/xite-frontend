"use server";
import {
  getMicrositeByCohort,
  getTemplatesByCohortId,
} from "@/modules/microsite-cms/modules/common/services/db";

export async function getTemplatesByCohortIdAction(cohortId: string) {
  try {
    const templates = await getTemplatesByCohortId(cohortId);
    return templates;
  } catch (error) {
    throw error;
  }
}

export async function getMicrositesByCohortIdAction(cohortId: string) {
  try {
    const microsites = await getMicrositeByCohort(cohortId);
    return microsites;
  } catch (error) {
    throw error;
  }
}
