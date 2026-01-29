"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { UpdateSchema } from "../schema";
import { revalidatePath } from "next/cache";
import { MODULE_PATH } from "@/modules/topic/contants";
import { requireAccess } from "@/modules/common/authentication/access-control/middleware/check-access";
import { logUpdate } from "@/modules/common/lib/audit-logger";
import { getAuthUser } from "@/modules/common/authentication/firebase/action";

type UpdateActionOutput = {
  error?: string;
  data?: PrimaryDB.SubTopicGetPayload<object>;
};

export async function updateAction(
  data: UpdateSchema,
  id: string,
): Promise<UpdateActionOutput> {
  try {
    await requireAccess("update", "Topic");

    // Get initial value for audit log
    const initialData = await primaryDB.subTopic.findUnique({
      where: { id },
    });

    const updatedData = await primaryDB.subTopic.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        keywords: data.keywords,
        taost_id: data.taost_id,
        topic: {
          connect: {
            id: data.topic_id,
          },
        },
      },
    });

    if (!updatedData) {
      throw new Error(`Failed to update SubTopic`);
    }

    // Log the audit entry
    try {
      const user = await getAuthUser();
      if (user) {
        await logUpdate(
          user.uid,
          user.name || user.email || "Unknown User",
          "SubTopic",
          updatedData.id,
          updatedData.title,
          "postgresql",
          initialData,
          updatedData,
          { topicId: data.topic_id },
        );
      }
    } catch (auditError) {
      console.error("Failed to create audit log:", auditError);
    }

    revalidatePath(MODULE_PATH);

    return { data: updatedData };
  } catch (error) {
    console.error(error);
    return { error: `Failed to update SubTopic` };
  }
}
