"use server";
import {
  updateOne,
  UpdateOneOutput,
} from "@/modules/topic/server/subtopic/update";
import { UpdateSchema } from "../schema";
import { revalidatePath } from "next/cache";
import { MODULE_PATH } from "@/modules/topic/contants";

type UpdateActionOutput = {
  error?: string;
  data?: UpdateOneOutput;
};

export async function updateAction(
  data: UpdateSchema,
  id: string
): Promise<UpdateActionOutput> {
  try {
    const updatedData = await updateOne({
      id,
      data,
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
