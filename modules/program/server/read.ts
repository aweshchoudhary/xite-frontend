"use server";
import { PrimaryDB, primaryDB } from "@/modules/common/database";
import { MODULE_NAME } from "../contants";
import { ProgramStatus } from "@/modules/common/database";
import { getLoggedInUser, isUserAdmin } from "@/modules/user/utils";

export type GetAllOutput = {
  data?: GetOne[];
  error?: string;
};

export async function getAll({
  status,
}: {
  status?: ProgramStatus | "ALL";
}): Promise<GetAllOutput> {
  try {
    const data = await primaryDB.program.findMany({
      where: status
        ? { status: status === "ALL" ? undefined : status }
        : undefined,
      include: {
        enterprise: true,
        academic_partner: true,
        cohorts: true,
      },
    });
    return { data };
  } catch (error) {
    console.error(error);
    return {
      error: `Failed to get all ${MODULE_NAME}`,
    };
  }
}

export type GetOne = PrimaryDB.ProgramGetPayload<{
  include: {
    enterprise: true;
    academic_partner: true;
    cohorts: true;
  };
}>;

export type GetOneInput = {
  id: string;
};

export type GetOneOutput = {
  data?: GetOne | null;
  error?: string;
};

export async function getOne({ id }: GetOneInput): Promise<GetOneOutput> {
  try {
    const data = await primaryDB.program.findUnique({
      where: { id },
      include: {
        enterprise: true,
        academic_partner: true,
        cohorts: true,
      },
    });
    return { data };
  } catch (error) {
    console.error(error);
    return {
      error: `Failed to get one ${MODULE_NAME}`,
    };
  }
}

export type GetCohortsByProgramId = PrimaryDB.CohortGetPayload<object>[];

export type GetCohortsByProgramIdOutput = {
  data?: GetCohortsByProgramId | null;
  error?: string;
};

export type GetCohortsByProgramIdInput = {
  programId: string;
};

export async function getCohortsByProgramId({
  programId,
}: GetCohortsByProgramIdInput): Promise<GetCohortsByProgramIdOutput> {
  try {
    const cohorts = await primaryDB.cohort.findMany({
      where: {
        program_id: programId,
      },
    });
    if (!cohorts) {
      throw new Error("No cohorts found");
    }
    return { data: cohorts };
  } catch (error) {
    console.error(error);
    return {
      error: `Failed to get cohorts by program id ${MODULE_NAME}`,
    };
  }
}

export type GetLastCohortByProgramId = PrimaryDB.CohortGetPayload<{
  include: {
    program: true;
  };
}>;

export type GetLastCohortByProgramIdInput = {
  programId: string;
};

export type GetLastCohortByProgramIdOutput = {
  data?: GetLastCohortByProgramId | null;
  error?: string;
};

export async function getLastCohortByProgramId({
  programId,
}: GetLastCohortByProgramIdInput): Promise<GetLastCohortByProgramIdOutput> {
  try {
    const lastCohort = await primaryDB.cohort.findFirst({
      where: {
        program_id: programId,
      },
      include: {
        program: true,
      },
      orderBy: {
        cohort_num: "desc",
      },
    });

    return { data: lastCohort };
  } catch (error) {
    console.error(error);
    return {
      error: `Failed to get last cohort by program id ${MODULE_NAME}`,
    };
  }
}
