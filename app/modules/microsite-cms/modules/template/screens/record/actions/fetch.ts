"use server";

import { getTemplateById } from "@microsite-cms/common/services/db/actions/template/read";

export async function fetchTemplate(id: string) {
  const template = await getTemplateById(id);
  return template;
}
