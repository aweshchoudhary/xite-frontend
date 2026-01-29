"use server";
import { MODULE_NAME } from "@/modules/topic/contants";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { revalidatePath } from "next/cache";
import { requireAccess } from "@/modules/common/authentication/access-control/middleware/check-access";
import { logDelete } from "@/modules/common/lib/audit-logger";
import { getAuthUser } from "@/modules/common/authentication/firebase/action";

type DeleteActionOutput = {
  error?: string;
  data?: PrimaryDB.TopicGetPayload<object>;
};

export async function deleteAction(id: string): Promise<DeleteActionOutput> {
  try {
    await requireAccess("delete", "Topic");

    // Get data before deletion for audit log
    const dataToDelete = await primaryDB.topic.findUnique({
      where: { id },
    });

    if (!dataToDelete) {
      throw new Error("Topic not found");
    }

    await primaryDB.subTopic.deleteMany({
      where: { topic_id: id },
    });

    const deletedData = await primaryDB.topic.delete({
      where: { id: id },
    });

    // Log the audit entry
    try {
      const user = await getAuthUser();
      if (user) {
        await logDelete(
          user.uid,
          user.name || user.email || "Unknown User",
          "Topic",
          deletedData.id,
          dataToDelete.title,
          "postgresql",
          dataToDelete,
        );
      }
    } catch (auditError) {
      console.error("Failed to create audit log:", auditError);
    }

    revalidatePath("/topics");

    return { data: deletedData };
  } catch (error) {
    console.error(error);
    return { error: `Failed to delete ${MODULE_NAME}` };
  }
}
