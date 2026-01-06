"use server";

import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant";

export type GetOne = PrimaryDB.AcademicPartnerGetPayload<{
  include: {
    programs: {
      select: {
        id: true;
        name: true;
        status: true;
        program_key: true;
      };
    };
    faculties: {
      select: {
        id: true;
        name: true;
        title: true;
        profile_image: true;
      };
    };
  };
}>;

export type GetOneOutput = {
  data?: GetOne | null;
  error?: string;
};

export async function getOneWithRelationsAction(
  id: string
): Promise<GetOneOutput> {
  try {
    const permission = await checkPermission("AcademicPartners", "read");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const academicPartner = await primaryDB.academicPartner.findUnique({
      where: { id },
      include: {
        programs: {
          select: {
            id: true,
            name: true,
            status: true,
            program_key: true,
          },
        },
        faculties: {
          select: {
            id: true,
            name: true,
            title: true,
            profile_image: true,
          },
        },
      },
    });

    return { data: academicPartner };
  } catch (error) {
    console.error(error);
    return {
      error: `Failed to get academic partner`,
    };
  }
}
