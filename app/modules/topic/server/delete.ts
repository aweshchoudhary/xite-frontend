"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { deleteRecord } from "@/modules/common/database/controllers/topic/delete";

export type DeleteOneOutput = PrimaryDB.TopicGetPayload<object>;

export async function deleteOne({
  id,
}: {
  id: string;
}): Promise<DeleteOneOutput> {
  try {
    // Delete related subtopics first
    await primaryDB.subTopic.deleteMany({
      where: { topic_id: id },
    });

    const deletedData = await deleteRecord({ recordId: id });
    return deletedData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
