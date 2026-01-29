"use server";

import { getTemplates } from "@/modules/common/database/mongodb/actions/template/read";
import { TemplateType } from "@/modules/common/database/mongodb/types/interfaces";

export async function getTemplateListAction(type?: TemplateType) {
  try {
    const templates = await getTemplates(type);
    return templates;
  } catch (error) {
    throw error;
  }
}
