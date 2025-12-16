"use server";
import {
  getMicrositesByCohortId,
  getTemplatesByCohortId,
} from "@microsite-cms/common/services/db";
import { IMicrosite } from "@microsite-cms/common/services/db/types/interfaces";

export async function getTemplatesByCohortIdAction(cohortId: string) {
  try {
    const templates = await getTemplatesByCohortId(cohortId);
    return templates;
  } catch (error) {
    throw error;
  }
}

export async function getMicrositesByCohortIdAction(
  cohortId: string
): Promise<IMicrosite[]> {
  try {
    const microsites = await getMicrositesByCohortId(cohortId);
    return microsites;
  } catch (error) {
    throw error;
  }
}
