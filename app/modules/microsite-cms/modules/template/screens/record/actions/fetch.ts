"use server";

import { getTemplateById } from "@/modules/common/database/mongodb/actions/template/read";

export async function fetchTemplate(id: string) {
  const template = await getTemplateById(id);
  return template;
}
