"use server";

import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant";

/**
 * Minimal cohort data for program cohort list
 */
export type GetCohortByProgramId = PrimaryDB.CohortGetPayload<{
  select: {
    id: true;
    name: true;
    status: true;
    cohort_key: true;
    program_id: true;
  };
}>;

export type GetCohortsByProgramIdOutput = {
  data?: GetCohortByProgramId[];
  error?: string;
};

export async function getCohortsByProgramIdAction(
  programId: string
): Promise<GetCohortsByProgramIdOutput> {
  try {
    const permission = await checkPermission("Cohort", "read");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const cohorts = await primaryDB.cohort.findMany({
      where: {
        program_id: programId,
      },
      select: {
        id: true,
        name: true,
        status: true,
        cohort_key: true,
        program_id: true,
      },
      orderBy: {
        cohort_num: "asc",
      },
    });

    return { data: cohorts };
  } catch (error) {
    console.error(error);
    return {
      error: `Failed to get cohorts by program ID`,
    };
  }
}

/**
 * Get last cohort by program ID - only returns fields needed for creating new cohort
 */
export type GetLastCohortByProgramIdOutput = {
  data: {
    cohort_num: number;
    program: {
      program_key: string;
    };
  } | null;
  error?: string;
};

export async function getLastCohortByProgramIdAction(
  programId: string
): Promise<GetLastCohortByProgramIdOutput> {
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

    return {
      data: cohort || null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: `Failed to get last cohort by program ID`,
    };
  }
}

