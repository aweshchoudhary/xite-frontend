import { getMicrosites } from "@microsite-cms/common/services/db/actions/microsite/read";

export async function fetchMicrosites() {
  const microsites = await getMicrosites();
  return JSON.parse(JSON.stringify(microsites));
}
