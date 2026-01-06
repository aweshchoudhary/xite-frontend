"use server";

import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant";

export type GetOne = PrimaryDB.EnterpriseGetPayload<{
  include: {
    programs: {
      select: {
        id: true;
        name: true;
        status: true;
        program_key: true;
        academic_partner: {
          select: {
            name: true;
          };
        };
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
    const permission = await checkPermission("Enterprise", "read");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const enterprise = await primaryDB.enterprise.findUnique({
      where: { id },
      include: {
        programs: {
          select: {
            id: true,
            name: true,
            status: true,
            program_key: true,
            academic_partner: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return { data: enterprise };
  } catch (error) {
    console.error(error);
    return {
      error: `Failed to get enterprise`,
    };
  }
}

