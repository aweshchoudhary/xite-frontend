"use server";
import {
  getMicrositesByCohortId,
  getMicrositeByCohortId,
  getTemplatesByCohortId,
  getTemplateById,
} from "@microsite-cms/common/services/db";
import {
  IMicrosite,
  ITemplate,
} from "@microsite-cms/common/services/db/types/interfaces";

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

export async function getMicrositeByCohortKeyAction(
  cohortKey: string
): Promise<IMicrosite | null> {
  try {
    const microsite = await getMicrositeByCohortId({ cohortId: cohortKey });
    return microsite;
  } catch (error) {
    throw error;
  }
}

export async function getTemplateByIdAction(
  id: string
): Promise<ITemplate | null> {
  try {
    const template = await getTemplateById(id);
    return template;
  } catch (error) {
    throw error;
  }
}
