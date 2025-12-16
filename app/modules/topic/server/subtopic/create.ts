import { primaryDB } from "@/modules/common/database/prisma/connection";
import { revalidatePath } from "next/cache";
import { MODULE_PATH } from "../../contants";
import { PrimaryDB } from "@/modules/common/database/prisma/types";

export type CreateOneOutput = PrimaryDB.SubTopicGetPayload<object>;

export async function createOne(
  data: PrimaryDB.SubTopicCreateInput
): Promise<CreateOneOutput> {
  try {
    const newData = await primaryDB.subTopic.create({
      data,
    });
    if (!newData) {
      throw new Error(`Failed to create SubTopic`);
    }

    revalidatePath(MODULE_PATH);

    return newData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


