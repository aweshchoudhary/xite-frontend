import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { MODULE_PATH } from "../contants";
import { revalidatePath } from "next/cache";
import { updateRecord } from "@/modules/common/database/controllers/topic/update";

export type UpdateOneOutput = PrimaryDB.TopicGetPayload<object>;

export async function updateOne({
  id,
  data,
}: {
  id: string;
  data: PrimaryDB.TopicUpdateInput;
}) {
  try {
    const updatedData = await updateRecord({
      recordId: id,
      data,
    });

    revalidatePath(MODULE_PATH);

    return updatedData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


