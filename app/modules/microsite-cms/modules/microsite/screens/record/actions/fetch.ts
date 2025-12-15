"use server";

import { getMicrositeById } from "@/modules/common/services/db/actions/microsite/read";
import { getTemplateById } from "@/modules/common/services/db/actions/template/read";

export async function fetchMicrosite(id: string) {
  const microsite = await getMicrositeById(id);
  if (!microsite) return null;
  
  const template = await getTemplateById(microsite.templateId);
  return { microsite, template };
}

