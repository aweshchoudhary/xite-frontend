"use server";

import { primaryDB } from "@/modules/common/database/prisma/connection";

export async function getDataListAction() {
  try {
    const dataList = await primaryDB.enterprise.findMany({});
    return { data: dataList };
  } catch (error) {
    throw error;
  }
}
