"use server";

import { getRecord, getManyRecords } from "@/modules/common/database/controllers/academic-partner/read";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant";

export type GetOne = Awaited<ReturnType<typeof getRecord>>;

export async function getOneAction(recordId: string) {
  try {
    const permission = await checkPermission("AcademicPartner", "read");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const academicPartner = await getRecord({ recordId });
    return { data: academicPartner };
  } catch (error) {
    throw error;
  }
}

export async function getAllAction() {
  try {
    const permission = await checkPermission("AcademicPartner", "read");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const academicPartners = await getManyRecords({});
    return { data: academicPartners };
  } catch (error) {
    throw error;
  }
}

