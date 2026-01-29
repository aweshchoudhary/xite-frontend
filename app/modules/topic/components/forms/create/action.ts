"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { CreateSchema } from "../schema";
import { revalidatePath } from "next/cache";
import { MODULE_NAME, MODULE_PATH } from "@/modules/topic/contants";
import { requireAccess } from "@/modules/common/authentication/access-control/middleware/check-access";

type CreateActionOutput = {
  error?: string;
  data?: PrimaryDB.TopicGetPayload<object>;
};

export async function createAction(
  data: CreateSchema,
): Promise<CreateActionOutput> {
  try {
    await requireAccess("create", "Topic");

    const createdData = await primaryDB.topic.create({
      data: data as PrimaryDB.TopicCreateInput,
    });

    if (!createdData) {
      throw new Error(`Failed to create ${MODULE_NAME}`);
    }

    revalidatePath("/topics");

    return { data: createdData };
  } catch (error) {
    console.error(error);
    return { error: `Failed to create ${MODULE_NAME}` };
  }
}
