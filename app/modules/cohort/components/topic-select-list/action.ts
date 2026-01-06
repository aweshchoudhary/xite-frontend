"use server";

import { primaryDB } from "@/modules/common/database/prisma/connection";

export async function getTopicListAction() {
  try {
    const data = await primaryDB.topic.findMany({});
    return data || [];
  } catch (error) {
    throw error;
  }
}




































