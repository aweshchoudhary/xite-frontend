"use server";

import { primaryDB } from "@/modules/common/database/prisma/connection";
import { WorkStatus } from "@/modules/common/database/prisma/generated/prisma";
import { revalidatePath } from "next/cache";
import { uploadFile } from "@/modules/common/services/file-upload";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant";

/**
 * Update checklist file and status together
 */
export type UpdateChecklistAndStatusOutput = {
  success: boolean;
  error?: string;
};

export async function updateChecklistAndStatusAction(
  cohortId: string,
  checklistFile: File
): Promise<UpdateChecklistAndStatusOutput> {
  try {
    const permission = await checkPermission("Cohort", "update");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const { fileUrl: checklist_file_url } = await uploadFile(checklistFile);

    await primaryDB.cohort.update({
      where: { id: cohortId },
      data: {
        checklist_file_url,
        status: WorkStatus.ACTIVE,
      },
    });

    revalidatePath(`/cohorts/${cohortId}`);
    revalidatePath(`/cohorts/${cohortId}/edit`);

    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: `Failed to update checklist and status`,
    };
  }
}

