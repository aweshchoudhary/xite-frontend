"use server";
import {
  CreateCohortOutputData,
  createCohort,
} from "@/modules/cohort/server/cohort/create";
import { CreateSchema } from "../schema";
import {
  getAll,
  getCohortsByProgramId,
  getLastCohortByProgramId,
  getOne,
} from "@/modules/program/server/read";
import { revalidatePath } from "next/cache";
import currencies from "@/modules/common/lib/currencies.json";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant";

export async function createCohortAction(
  data: CreateSchema
): Promise<CreateCohortOutputData> {
  try {
    const permission = await checkPermission("Cohort", "write");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const { fees, program_id, ...rest } = data;
    const currencyToCreate: { code: string; name: string; symbol: string }[] =
      [];
    fees.forEach((fee) => {
      currencies.forEach((currency) => {
        if (currency.code === fee.currency_code) {
          currencyToCreate.push({
            code: currency.code,
            name: currency.name,
            symbol: currency.symbol,
          });
        }
      });
    });
    const lastCohort = await getLastCohortByProgramId({
      programId: program_id,
    });

    let newCohortNumber = 0;
    let newCohortKey = "";

    if (lastCohort.data) {
      newCohortNumber = lastCohort.data.cohort_num + 1;
      newCohortKey =
        lastCohort.data.program.program_key + "-cohort-" + newCohortNumber;
    } else {
      newCohortNumber = 1;

      const { data: program } = await getOne({ id: program_id });
      if (!program) {
        throw new Error("Program not found");
      }
      newCohortKey = program.program_key + "-cohort-1";
    }

    const cohort = await createCohort({
      ...rest,
      cohort_num: newCohortNumber,
      cohort_key: newCohortKey,
      fees: {
        create: fees.map(({ amount, currency_code }) => ({
          amount,
          currency: {
            connectOrCreate: {
              where: {
                code: currency_code,
              },
              create: currencyToCreate.find(
                (currency) => currency.code === currency_code
              ) ?? {
                code: currency_code,
                name: currency_code,
                symbol: currency_code,
              },
            },
          },
        })),
      },
      program: {
        connect: {
          id: program_id,
        },
      },
    });

    if (!cohort) {
      throw new Error("Failed to create cohort");
    }

    revalidatePath("/cohorts");

    return cohort;
  } catch (error) {
    throw error;
  }
}

export async function getProgramsAction() {
  try {
    const permission = await checkPermission("Program", "read");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const programs = await getAll({});
    return programs;
  } catch (error) {
    throw error;
  }
}

export async function getCohortsCountAction(programId: string) {
  try {
    const permission = await checkPermission("Cohort", "read");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const { data: cohorts } = await getCohortsByProgramId({ programId });
    return cohorts?.length ?? 0;
  } catch (error) {
    throw error;
  }
}

export async function getLastCohortByProgramIdAction(programId: string) {
  try {
    const permission = await checkPermission("Cohort", "read");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const lastCohort = await getLastCohortByProgramId({ programId });
    return lastCohort;
  } catch (error) {
    throw error;
  }
}
