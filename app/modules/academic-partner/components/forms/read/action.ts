"use server";

import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant";

export type GetOne = PrimaryDB.AcademicPartnerGetPayload<object> | null;

export async function getOneAction(recordId: string) {
  try {
    const permission = await checkPermission("AcademicPartner", "read");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const academicPartner = await primaryDB.academicPartner.findUnique({
      where: { id: recordId },
    });
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

    const academicPartners = await primaryDB.academicPartner.findMany({});
    return { data: academicPartners };
  } catch (error) {
    throw error;
  }
}

