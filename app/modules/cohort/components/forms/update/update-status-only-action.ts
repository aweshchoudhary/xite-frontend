"use server";

import { primaryDB } from "@/modules/common/database/prisma/connection";
import { WorkStatus } from "@/modules/common/database/prisma/generated/prisma";
import { revalidatePath } from "next/cache";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant";
import { logUpdate } from "@/modules/common/lib/audit-logger";
import { getAuthUser } from "@/modules/common/authentication/firebase/action";

/**
 * Update only the status of a cohort
 */
export type UpdateStatusOnlyOutput = {
  success: boolean;
  error?: string;
};

export async function updateStatusOnlyAction(
  cohortId: string,
  status: WorkStatus,
): Promise<UpdateStatusOnlyOutput> {
  try {
    const permission = await checkPermission("Cohort", "update");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const initialCohort = await primaryDB.cohort.findUnique({
      where: { id: cohortId },
    });

    const cohort = await primaryDB.cohort.update({
      where: { id: cohortId },
      data: { status },
    });

    try {
      const user = await getAuthUser();
      if (user) {
        await logUpdate(
          user.uid,
          user.name || user.email || "Unknown User",
          "Cohort",
          cohort.id,
          cohort.cohort_name,
          "postgresql",
          initialCohort,
          cohort,
          { action: "status_only", status },
        );
      }
    } catch (auditError) {
      console.error("Failed to create audit log:", auditError);
    }

    revalidatePath(`/cohorts/${cohortId}`);
    revalidatePath(`/cohorts/${cohortId}/edit`);

    await sendEventToAutomations(cohortId);

    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: `Failed to update cohort status`,
    };
  }
}

export async function sendEventToAutomations(cohortId: string) {
  try {
    const resp = await fetch(
      `${process.env.AUTOMATIONS_API_URL}/automations/xite/cohort-active`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.AUTOMATIONS_API_KEY}`,
        },
        body: JSON.stringify({ cohortId }),
      },
    );

    return { resp };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
