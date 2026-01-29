"use server";

import { primaryDB } from "@/modules/common/database/prisma/connection";
import { WorkStatus } from "@/modules/common/database/prisma/generated/prisma";
import { revalidatePath } from "next/cache";
import { uploadFile } from "@/modules/common/services/file-upload";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant";
import { logUpdate } from "@/modules/common/lib/audit-logger";
import { getAuthUser } from "@/modules/common/authentication/firebase/action";

/**
 * Update checklist file and status together
 */
export type UpdateChecklistAndStatusOutput = {
  success: boolean;
  error?: string;
};

export async function updateChecklistAndStatusAction(
  cohortId: string,
  checklistFile: File,
): Promise<UpdateChecklistAndStatusOutput> {
  try {
    const permission = await checkPermission("Cohort", "update");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const { fileUrl: checklist_file_url } = await uploadFile(checklistFile);

    const initialCohort = await primaryDB.cohort.findUnique({
      where: { id: cohortId },
    });

    const cohort = await primaryDB.cohort.update({
      where: { id: cohortId },
      data: {
        checklist_file_url,
        status: WorkStatus.ACTIVE,
      },
    });

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
          { action: "checklist_and_status", checklist_file_url },
        );
      }
    } catch (auditError) {
      console.error("Failed to create audit log:", auditError);
    }

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
