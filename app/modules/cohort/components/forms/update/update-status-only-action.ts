"use server";

import { primaryDB } from "@/modules/common/database/prisma/connection";
import { WorkStatus } from "@/modules/common/database/prisma/generated/prisma";
import { revalidatePath } from "next/cache";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant";

/**
 * Update only the status of a cohort
 */
export type UpdateStatusOnlyOutput = {
  success: boolean;
  error?: string;
};

export async function updateStatusOnlyAction(
  cohortId: string,
  status: WorkStatus
): Promise<UpdateStatusOnlyOutput> {
  try {
    const permission = await checkPermission("Cohort", "update");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    await primaryDB.cohort.update({
      where: { id: cohortId },
      data: { status },
    });

    revalidatePath(`/cohorts/${cohortId}`);
    revalidatePath(`/cohorts/${cohortId}/edit`);

    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: `Failed to update cohort status`,
    };
  }
}

