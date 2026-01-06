"use server";

import { getRecord } from "@/modules/common/database/controllers/program/read";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant";

export type GetOne = Awaited<ReturnType<typeof getRecord>>;

export async function getOneAction(recordId: string) {
  try {
    const permission = await checkPermission("Program", "read");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const program = await getRecord({ recordId });
    return { data: program };
  } catch (error) {
    throw error;
  }
}

