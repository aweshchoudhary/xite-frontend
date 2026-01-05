"use server";

import { getTemplates } from "@microsite-cms/common/services/db/actions/template/read";
import { TemplateType } from "@/modules/microsite-cms/modules/common/services/db/types/interfaces";

export async function getTemplateListAction(type?: TemplateType) {
  try {
    const templates = await getTemplates(type);
    return templates;
  } catch (error) {
    throw error;
  }
}
