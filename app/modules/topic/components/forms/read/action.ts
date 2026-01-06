"use server";

import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant";

export type GetOne = PrimaryDB.TopicGetPayload<object> | null;

export async function getOneAction(recordId: string) {
  try {
    const permission = await checkPermission("Topic", "read");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const topic = await primaryDB.topic.findUnique({
      where: { id: recordId },
    });
    return { data: topic };
  } catch (error) {
    throw error;
  }
}

export async function getAllAction() {
  try {
    const permission = await checkPermission("Topic", "read");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const topics = await primaryDB.topic.findMany({});
    return { data: topics };
  } catch (error) {
    throw error;
  }
}

