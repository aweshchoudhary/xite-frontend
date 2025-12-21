"use server";

import { getAll } from "@/modules/topic/server/read";

export async function getTopicListAction() {
  try {
    const { data } = await getAll();
    return data || [];
  } catch (error) {
    throw error;
  }
}









