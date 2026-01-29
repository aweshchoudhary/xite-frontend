import { TemplateType } from "@/modules/common/database/mongodb/types/interfaces";
import { getMicrosites } from "@/modules/common/database/mongodb/actions/microsite/read";

export async function fetchMicrosites(type?: TemplateType) {
  const microsites = await getMicrosites(type);
  return JSON.parse(JSON.stringify(microsites));
}
