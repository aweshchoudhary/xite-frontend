"use server";

import { getMicrositeById } from "@/modules/common/database/mongodb/actions/microsite/read";
import { getTemplateById } from "@/modules/common/database/mongodb/actions/template/read";

export async function fetchMicrosite(id: string) {
  const microsite = await getMicrositeById(id);
  if (!microsite) return null;

  const template = await getTemplateById(microsite.templateId);
  return { microsite, template };
}
