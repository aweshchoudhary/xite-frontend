"use server";

import { primaryDB } from "@/modules/common/database/prisma/connection";

export async function getSubTopicListAction(topicId: string) {
  try {
    if (!topicId) {
      return [];
    }
    const data = await primaryDB.topic.findUnique({
      where: { id: topicId },
      include: { sub_topics: true }
    });
    return data?.sub_topics || [];
  } catch (error) {
    throw error;
  }
}




































