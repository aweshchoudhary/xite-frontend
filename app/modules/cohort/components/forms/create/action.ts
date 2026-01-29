"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { CreateSchema } from "../schema";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { getLastCohortForCreateAction } from "./get-last-cohort-for-create-action";
import { revalidatePath } from "next/cache";
import currencies from "@/modules/common/lib/currencies.json";
import { requireAccess } from "@/modules/common/authentication/access-control/middleware/check-access";
import { logCreate } from "@/modules/common/lib/audit-logger";
import { getAuthUser } from "@/modules/common/authentication/firebase/action";

export async function createCohortAction(
  data: CreateSchema,
): Promise<PrimaryDB.CohortGetPayload<object>> {
  try {
    await requireAccess("create", "Cohort");

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
    const { data: lastCohort } = await getLastCohortForCreateAction(program_id);

    let newCohortNumber = 0;
    let newCohortKey = "";

    if (lastCohort) {
      newCohortNumber = lastCohort.cohort_num + 1;
      newCohortKey = lastCohort.program_key + "-cohort-" + newCohortNumber;
    } else {
      newCohortNumber = 1;
      // This should not happen as getLastCohortForCreateAction handles the case
      throw new Error("Failed to get program key");
    }

    const cohort = await primaryDB.cohort.create({
      data: {
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
                  (currency) => currency.code === currency_code,
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
      },
    });

    if (!cohort) {
      throw new Error("Failed to create cohort");
    }

    // Log the audit entry
    try {
      const user = await getAuthUser();
      if (user) {
        await logCreate(
          user.uid,
          user.name || user.email || "Unknown User",
          "Cohort",
          cohort.id,
          cohort.cohort_name,
          "postgresql",
          cohort,
          { programId: program_id },
        );
      }
    } catch (auditError) {
      // Don't fail the main operation if audit logging fails
      console.error("Failed to create audit log:", auditError);
    }

    revalidatePath("/cohorts");

    return cohort;
  } catch (error) {
    throw error;
  }
}

export async function getProgramsAction() {
  try {
    await requireAccess("read", "Program");

    const programs = await primaryDB.program.findMany({});
    return { data: programs };
  } catch (error) {
    throw error;
  }
}
