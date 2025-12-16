"use server";
import {
  createOne,
  CreateOneOutput,
} from "@/modules/topic/server/subtopic/create";
import { CreateSchema } from "../schema";
import { revalidatePath } from "next/cache";
import { MODULE_PATH } from "@/modules/topic/contants";

type CreateActionOutput = {
  error?: string;
  data?: CreateOneOutput;
};

export async function createAction(
  data: CreateSchema
): Promise<CreateActionOutput> {
  try {
    const createdData = await createOne(data);

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

