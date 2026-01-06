"use server";

"use server";

import { getRecord } from "@/modules/common/database/controllers/topic/read";

export async function getSubTopicListAction(topicId: string) {
  try {
    if (!topicId) {
      return [];
    }
    const data = await getRecord({ 
      recordId: topicId,
      include: { sub_topics: true }
    });
    return data?.sub_topics || [];
  } catch (error) {
    throw error;
  }
}




































