"use server";

"use server";

import { getManyRecords } from "@/modules/common/database/controllers/faculty/read";

export async function getDataList() {
  const dataList = await getManyRecords({}); // TODO: change to industry expert
  return { data: dataList };
}
