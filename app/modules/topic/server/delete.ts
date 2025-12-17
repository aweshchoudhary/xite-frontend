"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";

export type DeleteOneOutput = PrimaryDB.TopicGetPayload<object>;

export async function deleteOne({
  id,
}: {
  id: string;
}): Promise<DeleteOneOutput> {
  try {
    await primaryDB.subTopic.deleteMany({
      where: { topic_id: id },
    });

    const deletedData = await primaryDB.topic.delete({
      where: { id },
    });

    return deletedData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
