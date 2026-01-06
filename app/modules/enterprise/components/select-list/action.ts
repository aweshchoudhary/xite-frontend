"use server";

import { getManyRecords } from "@/modules/common/database/controllers/enterprise/read";

export async function getEnterpriseListAction() {
  try {
    const enterpriseList = await getManyRecords({});
    return { data: enterpriseList };
  } catch (error) {
    throw error;
  }
}
