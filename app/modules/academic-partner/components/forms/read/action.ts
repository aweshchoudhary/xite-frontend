"use server";

import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant";

export type GetOne = PrimaryDB.AcademicPartnerGetPayload<{
  include: {
    programs: {
      include: {
        academic_partner: {
          select: {
            name: true;
          };
        };
      };
    };
    faculties: true;
  };
}>;

export type GetAcademicPartnerForTable = PrimaryDB.AcademicPartnerGetPayload<{
  include: {
    programs: true;
    faculties: true;
  };
}>;

export async function getOneAction(recordId: string) {
  try {
    const permission = await checkPermission("AcademicPartners", "read");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const academicPartner = await primaryDB.academicPartner.findUnique({
      where: { id: recordId },
      include: {
        programs: true,
        faculties: true,
      },
    });
    return { data: academicPartner };
  } catch (error) {
    throw error;
  }
}

export async function getAllAction() {
  try {
    const permission = await checkPermission("AcademicPartners", "read");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const academicPartners = await primaryDB.academicPartner.findMany({});
    return { data: academicPartners };
  } catch (error) {
    throw error;
  }
}
