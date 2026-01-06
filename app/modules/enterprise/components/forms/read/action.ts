"use server";

import { getRecord, getManyRecords } from "@/modules/common/database/controllers/enterprise/read";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant";

export type GetOneOutput = Awaited<ReturnType<typeof getRecord>>;

export async function getOneAction(recordId: string) {
  try {
    const permission = await checkPermission("Enterprise", "read");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const enterprise = await getRecord({ recordId });
    return { data: enterprise };
  } catch (error) {
    throw error;
  }
}

export async function getAllAction() {
  try {
    const permission = await checkPermission("Enterprise", "read");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const enterprises = await getManyRecords({});
    return { data: enterprises };
  } catch (error) {
    throw error;
  }
}

