"use server";
import {
  updateCohort,
  UpdateCohortInputData,
} from "@/modules/cohort/server/cohort/update";
import { UpdateSchema } from "../schema";
import { revalidatePath } from "next/cache";
import { uploadFile } from "@/modules/common/services/file-upload";
import { WorkStatus } from "@/modules/common/database";
import currencies from "@/modules/common/lib/currencies.json";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant";

export async function updateCohortAction(data: UpdateSchema, recordId: string) {
  try {
    const permission = await checkPermission("Cohort", "update");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const { fees, program_id, ...rest } = data;

    const currencyToCreate: { code: string; name: string; symbol: string }[] =
      [];

    data.fees.forEach((fee) => {
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

    const feesToCreate = fees.filter((fee) => fee.action === "create");
    const feesToUpdate = fees.filter((fee) => fee.action === "update");
    const feesToDelete = fees.filter((fee) => fee.action === "delete");

    const dataToUpdate: UpdateCohortInputData = {
      ...rest,
      program: {
        connect: {
          id: program_id,
        },
      },
      fees: {
        create: feesToCreate.map(({ amount, currency_code }) => ({
          amount,
          currency: {
            connectOrCreate: {
              where: {
                code: currency_code,
              },
              create: currencyToCreate.find(
                (currency) => currency.code === currency_code
              ) || {
                code: currency_code || "",
                name:
                  currencies.find((c) => c.code === currency_code)?.name || "",
                symbol:
                  currencies.find((c) => c.code === currency_code)?.symbol ||
                  "",
              },
            },
          },
        })),
        update: feesToUpdate.map(({ id, amount, currency_code }) => ({
          where: {
            id,
          },
          data: {
            amount,
            currency: {
              connectOrCreate: {
                where: {
                  code: currency_code,
                },
                create: currencyToCreate.find(
                  (currency) => currency.code === currency_code
                ) || {
                  code: currency_code || "",
                  name:
                    currencies.find((c) => c.code === currency_code)?.name ||
                    "",
                  symbol:
                    currencies.find((c) => c.code === currency_code)?.symbol ||
                    "",
                },
              },
            },
          },
        })),
        delete: feesToDelete.map((fee) => ({
          id: fee.id,
        })),
      },
    };

    const cohort = await updateCohort({
      cohortId: recordId,
      data: dataToUpdate,
    });

    if (!cohort) {
      throw new Error("Failed to update cohort");
    }

    revalidatePath("/cohorts");
    revalidatePath(`/cohorts/${recordId}/edit`);
    revalidatePath(`/cohorts/${recordId}`);
  } catch (error) {
    throw error;
  }
}

export async function updateBannerAction(cohortId: string, banner: File) {
  try {
    const permission = await checkPermission("Cohort", "update");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const { fileUrl: banner_url } = await uploadFile(banner);

    const cohort = await updateCohort({
      cohortId,
      data: {
        media_section: {
          update: {
            banner_image_url: banner_url,
          },
        },
      },
    });

    if (!cohort) {
      throw new Error("Failed to update cohort");
    }

    revalidatePath(`/cohorts/${cohortId}`);
    revalidatePath(`/cohorts/${cohortId}/edit`);
    revalidatePath(`/cohorts/${cohortId}`);
  } catch (error) {
    throw error;
  }
}

export async function updateBrochureAction(cohortId: string, brochure: File) {
  try {
    const permission = await checkPermission("Cohort", "update");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const { fileUrl: brochure_url } = await uploadFile(brochure);

    const cohort = await updateCohort({
      cohortId,
      data: {
        media_section: {
          update: {
            brochure_url: brochure_url,
          },
        },
      },
    });

    if (!cohort) {
      throw new Error("Failed to update cohort");
    }

    revalidatePath(`/cohorts/${cohortId}`);
    revalidatePath(`/cohorts/${cohortId}/edit`);
    revalidatePath(`/cohorts/${cohortId}`);
  } catch (error) {
    throw error;
  }
}

export async function updateCohortStatusAction(
  cohortId: string,
  status: WorkStatus
) {
  try {
    const permission = await checkPermission("Cohort", "update");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const cohort = await updateCohort({
      cohortId,
      data: { status },
    });

    if (!cohort) {
      throw new Error("Failed to update cohort");
    }

    revalidatePath(`/cohorts/${cohortId}`);
    revalidatePath(`/cohorts/${cohortId}/edit`);
    revalidatePath(`/cohorts/${cohortId}`);
  } catch (error) {
    throw error;
  }
}
