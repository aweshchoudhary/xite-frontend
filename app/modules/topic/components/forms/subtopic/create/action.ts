"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { CreateSchema } from "../schema";
import { revalidatePath } from "next/cache";
import { MODULE_PATH } from "@/modules/topic/contants";

type CreateActionOutput = {
  error?: string;
  data?: PrimaryDB.SubTopicGetPayload<object>;
};

export async function createAction(
  data: CreateSchema
): Promise<CreateActionOutput> {
  try {
    const createdData = await primaryDB.subTopic.create({
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

    if (!createdData) {
      throw new Error(`Failed to create SubTopic`);
    }

    revalidatePath(MODULE_PATH);

    return { data: createdData };
  } catch (error) {
    console.error(error);
    return { error: `Failed to create SubTopic` };
  }
}
