"use server";

import { primaryDB } from "@/modules/common/database/prisma/connection";

export async function getEnterpriseListAction() {
  try {
    const enterpriseList = await primaryDB.enterprise.findMany({});
    return { data: enterpriseList };
  } catch (error) {
    throw error;
  }
}
