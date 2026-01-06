"use server";

import { primaryDB } from "@/modules/common/database/prisma/connection";

export async function getDataList() {
  const dataList = await primaryDB.faculty.findMany({}); // TODO: change to industry expert
  return { data: dataList };
}
