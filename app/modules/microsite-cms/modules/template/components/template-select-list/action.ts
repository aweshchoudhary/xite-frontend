"use server";

import { getTemplates } from "@microsite-cms/common/services/db/actions/template/read";

export async function getTemplateListAction() {
  try {
    const templates = await getTemplates();
    return templates;
  } catch (error) {
    throw error;
  }
}
