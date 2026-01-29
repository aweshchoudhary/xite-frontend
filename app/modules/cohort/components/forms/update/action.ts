"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { UpdateSchema } from "../schema";
import { revalidatePath } from "next/cache";
import currencies from "@/modules/common/lib/currencies.json";
import { requireAccess } from "@/modules/common/authentication/access-control/middleware/check-access";
import { logUpdate } from "@/modules/common/lib/audit-logger";
import { getAuthUser } from "@/modules/common/authentication/firebase/action";

export async function updateCohortAction(data: UpdateSchema, recordId: string) {
  try {
    await requireAccess("update", "Cohort");

    // Get initial value for audit log
    const initialCohort = await primaryDB.cohort.findUnique({
      where: { id: recordId },
      include: { fees: true },
    });

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

    const dataToUpdate: PrimaryDB.CohortUpdateInput = {
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
                (currency) => currency.code === currency_code,
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
                  (currency) => currency.code === currency_code,
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

    const cohort = await primaryDB.cohort.update({
      where: { id: recordId },
      data: dataToUpdate,
      include: { fees: true },
    });

    if (!cohort) {
      throw new Error("Failed to update cohort");
    }

    // Log the audit entry
    try {
      const user = await getAuthUser();
      if (user) {
        await logUpdate(
          user.uid,
          user.name || user.email || "Unknown User",
          "Cohort",
          cohort.id,
          cohort.name || "Untitled Cohort",
          "postgresql",
          initialCohort,
          cohort,
          { programId: program_id },
        );
      }
    } catch (auditError) {
      // Don't fail the main operation if audit logging fails
      console.error("Failed to create audit log:", auditError);
    }

    revalidatePath("/cohorts");
    revalidatePath(`/cohorts/${recordId}/edit`);
    revalidatePath(`/cohorts/${recordId}`);
  } catch (error) {
    throw error;
  }
}
