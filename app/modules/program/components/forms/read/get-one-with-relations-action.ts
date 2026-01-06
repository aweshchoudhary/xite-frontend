"use server";

import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant";

export type GetOne = PrimaryDB.ProgramGetPayload<{
  include: {
    academic_partner: true;
    enterprise: true;
    tags: true;
    cohorts: true;
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
    const permission = await checkPermission("Program", "read");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const program = await primaryDB.program.findUnique({
      where: { id },
      include: {
        academic_partner: true,
        enterprise: true,
        tags: true,
        cohorts: true,
      },
    });

    return { data: program };
  } catch (error) {
    console.error(error);
    return {
      error: `Failed to get program`,
    };
  }
}

