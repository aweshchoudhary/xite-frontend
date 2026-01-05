"use server";

import { getAll } from "@/modules/faculty/server/read";

export async function getDataList() {
  const dataList = await getAll(); // TODO: change to industry expert
  return dataList;
}
