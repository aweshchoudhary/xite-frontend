"use server";

import { getRecord, getManyRecords } from "@/modules/common/database/controllers/faculty/read";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant";

export type GetOneOutput = Awaited<ReturnType<typeof getRecord>>;

export async function getOneAction(recordId: string) {
  try {
    const permission = await checkPermission("Faculty", "read");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const faculty = await getRecord({ recordId });
    return { data: faculty };
  } catch (error) {
    throw error;
  }
}

export async function getAllAction() {
  try {
    const permission = await checkPermission("Faculty", "read");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const faculties = await getManyRecords({});
    return { data: faculties };
  } catch (error) {
    throw error;
  }
}

