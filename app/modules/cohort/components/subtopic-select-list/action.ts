"use server";

import { getOne } from "@/modules/topic/server/read";

export async function getSubTopicListAction(topicId: string) {
  try {
    if (!topicId) {
      return [];
    }
    const { data } = await getOne({ id: topicId });
    return data?.sub_topics || [];
  } catch (error) {
    throw error;
  }
}





























