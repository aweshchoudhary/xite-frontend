import { TemplateType } from "@/modules/microsite-cms/modules/common/services/db/types/interfaces";
import { getMicrosites } from "@microsite-cms/common/services/db/actions/microsite/read";

export async function fetchMicrosites(type?: TemplateType) {
  const microsites = await getMicrosites(type);
  return JSON.parse(JSON.stringify(microsites));
}
