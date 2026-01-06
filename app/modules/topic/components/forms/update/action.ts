"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { UpdateSchema } from "../schema";
import { revalidatePath } from "next/cache";
import { MODULE_NAME, MODULE_PATH } from "@/modules/topic/contants";

type UpdateActionOutput = {
  error?: string;
  data?: PrimaryDB.TopicGetPayload<object>;
};

export async function updateAction(
  data: UpdateSchema,
  id: string
): Promise<UpdateActionOutput> {
  try {
    const updatedData = await primaryDB.topic.update({
      where: { id: id },
      data: data as PrimaryDB.TopicUpdateInput,
    });

    if (!updatedData) {
      throw new Error(`Failed to update ${MODULE_NAME}`);
    }

    revalidatePath(MODULE_PATH);

    return { data: updatedData };
  } catch (error) {
    console.error(error);
    return { error: `Failed to update ${MODULE_NAME}` };
  }
}


