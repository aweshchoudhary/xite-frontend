"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { revalidatePath } from "next/cache";
import { requireAccess } from "@/modules/common/authentication/access-control/middleware/check-access";
import { logDelete } from "@/modules/common/lib/audit-logger";
import { getAuthUser } from "@/modules/common/authentication/firebase/action";

type DeleteActionOutput = {
  error?: string;
  data?: PrimaryDB.SubTopicGetPayload<object>;
};

export async function deleteAction(id: string): Promise<DeleteActionOutput> {
  try {
    await requireAccess("delete", "Topic");

    // Get data before deletion for audit log
    const dataToDelete = await primaryDB.subTopic.findUnique({
      where: { id },
    });

    if (!dataToDelete) {
      throw new Error("SubTopic not found");
    }

    const deletedData = await primaryDB.subTopic.delete({
      where: { id },
    });

    // Log the audit entry
    try {
      const user = await getAuthUser();
      if (user) {
        await logDelete(
          user.uid,
          user.name || user.email || "Unknown User",
          "SubTopic",
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
    return { error: `Failed to delete SubTopic` };
  }
}
