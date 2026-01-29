"use server";

import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant";

export type GetOne = PrimaryDB.ProgramGetPayload<{
  include: {
    academic_partner: {
      select: {
        name: true;
      };
    };
    enterprise: {
      select: {
        name: true;
      };
    };
  };
}>;

export async function getOneAction(recordId: string) {
  try {
    const permission = await checkPermission("Program", "read");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const program = await primaryDB.program.findUnique({
      where: { id: recordId },
      include: {
        academic_partner: {
          select: {
            name: true,
          },
        },
      },
    });
    return { data: program };
  } catch (error) {
    throw error;
  }
}
