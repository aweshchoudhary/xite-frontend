"use server";

import { getTemplateById } from "@/modules/microsite-cms/modules/common/services/db/actions/template/read";

export async function fetchTemplate(id: string) {
  const template = await getTemplateById(id);
  return template;
}
