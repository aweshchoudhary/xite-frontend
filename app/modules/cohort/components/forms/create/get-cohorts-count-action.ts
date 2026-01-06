"use server";

import { primaryDB } from "@/modules/common/database/prisma/connection";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant";

/**
 * Get count of cohorts for a program
 */
export type GetCohortsCountOutput = {
  data?: number;
  error?: string;
};

export async function getCohortsCountAction(
  programId: string
): Promise<GetCohortsCountOutput> {
  try {
    const permission = await checkPermission("Cohort", "read");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const count = await primaryDB.cohort.count({
      where: {
        program_id: programId,
      },
    });

    return { data: count };
  } catch (error) {
    console.error(error);
    return {
      error: `Failed to get cohorts count`,
    };
  }
}

