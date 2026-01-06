"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { UpdateSchema } from "../schema";
import { revalidatePath } from "next/cache";
import { MODULE_PATH } from "@/modules/topic/contants";

type UpdateActionOutput = {
  error?: string;
  data?: PrimaryDB.SubTopicGetPayload<object>;
};

export async function updateAction(
  data: UpdateSchema,
  id: string
): Promise<UpdateActionOutput> {
  try {
    const updatedData = await primaryDB.subTopic.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        keywords: data.keywords,
        taost_id: data.taost_id,
        topic: {
          connect: {
            id: data.topic_id,
          },
        },
      },
    });

    if (!updatedData) {
      throw new Error(`Failed to update SubTopic`);
    }

    revalidatePath(MODULE_PATH);

    return { data: updatedData };
  } catch (error) {
    console.error(error);
    return { error: `Failed to update SubTopic` };
  }
}
