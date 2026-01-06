"use server";
import { MODULE_NAME, MODULE_PATH } from "@/modules/topic/contants";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { revalidatePath } from "next/cache";

type DeleteActionOutput = {
  error?: string;
  data?: PrimaryDB.TopicGetPayload<object>;
};

export async function deleteAction(id: string): Promise<DeleteActionOutput> {
  try {
    const deletedData = await primaryDB.topic.delete({
      where: { id: id },
    });

    revalidatePath(MODULE_PATH);

    return { data: deletedData };
  } catch (error) {
    console.error(error);
    return { error: `Failed to delete ${MODULE_NAME}` };
  }
}


