"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { UpdateSchema } from "../schema";
import { revalidatePath } from "next/cache";
import { MODULE_NAME, MODULE_PATH } from "@/modules/topic/contants";
import { requireAccess } from "@/modules/common/authentication/access-control/middleware/check-access";
import { logUpdate } from "@/modules/common/lib/audit-logger";
import { getAuthUser } from "@/modules/common/authentication/firebase/action";

type UpdateActionOutput = {
  error?: string;
  data?: PrimaryDB.TopicGetPayload<object>;
};

export async function updateAction(
  data: UpdateSchema,
  id: string,
): Promise<UpdateActionOutput> {
  try {
    await requireAccess("update", "Topic");

    // Get initial value for audit log
    const initialData = await primaryDB.topic.findUnique({
      where: { id },
    });

    const updatedData = await primaryDB.topic.update({
      where: { id: id },
      data: data as PrimaryDB.TopicUpdateInput,
    });

    if (!updatedData) {
      throw new Error(`Failed to update ${MODULE_NAME}`);
    }

    // Log the audit entry
    try {
      const user = await getAuthUser();
      if (user) {
        await logUpdate(
          user.uid,
          user.name || user.email || "Unknown User",
          "Topic",
          updatedData.id,
          updatedData.title,
          "postgresql",
          initialData,
          updatedData,
        );
      }
    } catch (auditError) {
      console.error("Failed to create audit log:", auditError);
    }

    revalidatePath(MODULE_PATH);

    return { data: updatedData };
  } catch (error) {
    console.error(error);
    return { error: `Failed to update ${MODULE_NAME}` };
  }
}
