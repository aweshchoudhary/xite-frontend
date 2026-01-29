"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { CreateSchema } from "../schema";
import { revalidatePath } from "next/cache";
import { MODULE_PATH } from "@/modules/topic/contants";
import { requireAccess } from "@/modules/common/authentication/access-control/middleware/check-access";
import { logCreate } from "@/modules/common/lib/audit-logger";
import { getAuthUser } from "@/modules/common/authentication/firebase/action";

type CreateActionOutput = {
  error?: string;
  data?: PrimaryDB.SubTopicGetPayload<object>;
};

export async function createAction(
  data: CreateSchema,
): Promise<CreateActionOutput> {
  try {
    await requireAccess("create", "Topic");

    const createdData = await primaryDB.subTopic.create({
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

    if (!createdData) {
      throw new Error(`Failed to create SubTopic`);
    }

    // Log the audit entry
    try {
      const user = await getAuthUser();
      if (user) {
        await logCreate(
          user.uid,
          user.name || user.email || "Unknown User",
          "SubTopic",
          createdData.id,
          createdData.title,
          "postgresql",
          createdData,
          { topicId: data.topic_id },
        );
      }
    } catch (auditError) {
      console.error("Failed to create audit log:", auditError);
    }

    revalidatePath("/topics");

    return { data: createdData };
  } catch (error) {
    console.error(error);
    return { error: `Failed to create SubTopic` };
  }
}
