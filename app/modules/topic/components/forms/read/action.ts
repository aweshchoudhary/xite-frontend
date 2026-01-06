"use server";

import { getRecord, getManyRecords } from "@/modules/common/database/controllers/topic/read";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant";

export type GetOne = Awaited<ReturnType<typeof getRecord>>;

export async function getOneAction(recordId: string) {
  try {
    const permission = await checkPermission("Topic", "read");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const topic = await getRecord({ recordId });
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

    const topics = await getManyRecords({});
    return { data: topics };
  } catch (error) {
    throw error;
  }
}

