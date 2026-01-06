"use server";

import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant";

export type GetOneOutput = PrimaryDB.EnterpriseGetPayload<object> | null;

export async function getOneAction(recordId: string) {
  try {
    const permission = await checkPermission("Enterprise", "read");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const enterprise = await primaryDB.enterprise.findUnique({
      where: { id: recordId },
    });
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

    const enterprises = await primaryDB.enterprise.findMany({});
    return { data: enterprises };
  } catch (error) {
    throw error;
  }
}

