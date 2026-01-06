"use server";

"use server";

import { getManyRecords } from "@/modules/common/database/controllers/topic/read";

export async function getTopicListAction() {
  try {
    const data = await getManyRecords({});
    return data || [];
  } catch (error) {
    throw error;
  }
}




































