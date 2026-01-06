"use server";

import { primaryDB } from "@/modules/common/database/prisma/connection";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant";

/**
 * Output for getting last cohort data needed for creating a new cohort
 */
export type GetLastCohortForCreateOutput = {
  data: {
    cohort_num: number;
    program_key: string;
  } | null;
  error?: string;
};

/**
 * Get last cohort data needed for creating a new cohort
 * Only returns cohort_num and program_key
 */
export async function getLastCohortForCreateAction(
  programId: string
): Promise<GetLastCohortForCreateOutput> {
  try {
    const permission = await checkPermission("Cohort", "read");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const cohort = await primaryDB.cohort.findFirst({
      where: {
        program_id: programId,
      },
      select: {
        cohort_num: true,
        program: {
          select: {
            program_key: true,
          },
        },
      },
      orderBy: {
        cohort_num: "desc",
      },
    });

    if (!cohort) {
      // If no cohort exists, get program_key from program
      const program = await primaryDB.program.findUnique({
        where: { id: programId },
        select: {
          program_key: true,
        },
      });

      if (!program) {
        throw new Error("Program not found");
      }

      return {
        data: {
          cohort_num: 0,
          program_key: program.program_key,
        },
      };
    }

    return {
      data: {
        cohort_num: cohort.cohort_num,
        program_key: cohort.program.program_key,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: `Failed to get last cohort for create`,
    };
  }
}

