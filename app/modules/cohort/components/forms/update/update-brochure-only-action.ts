"use server";

import { primaryDB } from "@/modules/common/database/prisma/connection";
import { revalidatePath } from "next/cache";
import { uploadFile } from "@/modules/common/services/file-upload";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant";
import { logUpdate } from "@/modules/common/lib/audit-logger";
import { getAuthUser } from "@/modules/common/authentication/firebase/action";

/**
 * Update only the brochure of a cohort
 */
export type UpdateBrochureOnlyOutput = {
  success: boolean;
  error?: string;
};

export async function updateBrochureOnlyAction(
  cohortId: string,
  brochure: File,
): Promise<UpdateBrochureOnlyOutput> {
  try {
    const permission = await checkPermission("Cohort", "update");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const { fileUrl: brochure_url } = await uploadFile(brochure);

    const cohort = await primaryDB.cohort.findUnique({
      where: { id: cohortId },
      include: { media_section: true },
    });

    await primaryDB.cohort.update({
      where: { id: cohortId },
      data: {
        media_section: {
          update: {
            brochure_url: brochure_url,
          },
        },
      },
    });

    const updatedCohort = await primaryDB.cohort.findUnique({
      where: { id: cohortId },
      include: { media_section: true },
    });

    try {
      const user = await getAuthUser();
      if (user && cohort && updatedCohort) {
        await logUpdate(
          user.uid,
          user.name || user.email || "Unknown User",
          "Cohort",
          cohortId,
          cohort.name || "Untitled Cohort",
          "postgresql",
          cohort,
          updatedCohort,
          { action: "brochure_only", brochure_url },
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
      error: `Failed to update brochure`,
    };
  }
}
