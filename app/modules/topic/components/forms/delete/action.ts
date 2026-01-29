"use server";
import { MODULE_NAME } from "@/modules/topic/contants";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { revalidatePath } from "next/cache";
import { requireAccess } from "@/modules/common/authentication/access-control/middleware/check-access";

type DeleteActionOutput = {
  error?: string;
  data?: PrimaryDB.TopicGetPayload<object>;
};

export async function deleteAction(id: string): Promise<DeleteActionOutput> {
  try {
    await requireAccess("delete", "Topic");

    await primaryDB.subTopic.deleteMany({
      where: { topic_id: id },
    });

    const deletedData = await primaryDB.topic.delete({
      where: { id: id },
    });

    revalidatePath("/topics");

    return { data: deletedData };
  } catch (error) {
    console.error(error);
    return { error: `Failed to delete ${MODULE_NAME}` };
  }
}
