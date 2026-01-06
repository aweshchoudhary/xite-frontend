"use server";

import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant";

export type GetAllOutput = {
  data?: PrimaryDB.ProgramGetPayload<object>[];
  error?: string;
};

export async function getAllAction(): Promise<GetAllOutput> {
  try {
    const permission = await checkPermission("Program", "read");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const programs = await primaryDB.program.findMany({
      orderBy: {
        updated_at: "desc",
      },
    });

    return { data: programs };
  } catch (error) {
    console.error(error);
    return {
      error: `Failed to get all programs`,
    };
  }
}

