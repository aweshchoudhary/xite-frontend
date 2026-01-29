"use server";

import { primaryDB } from "@/modules/common/database/prisma/connection";
import { revalidatePath } from "next/cache";
import { uploadFile } from "@/modules/common/services/file-upload";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant";
import { logUpdate } from "@/modules/common/lib/audit-logger";
import { getAuthUser } from "@/modules/common/authentication/firebase/action";

/**
 * Update only the banner image of a cohort
 */
export type UpdateBannerOnlyOutput = {
  success: boolean;
  error?: string;
};

export async function updateBannerOnlyAction(
  cohortId: string,
  banner: File,
): Promise<UpdateBannerOnlyOutput> {
  try {
    const permission = await checkPermission("Cohort", "update");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const { fileUrl: banner_url } = await uploadFile(banner);

    const cohort = await primaryDB.cohort.findUnique({
      where: { id: cohortId },
      include: { media_section: true },
    });

    await primaryDB.cohort.update({
      where: { id: cohortId },
      data: {
        media_section: {
          update: {
            banner_image_url: banner_url,
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
          cohort.cohort_name,
          "postgresql",
          cohort,
          updatedCohort,
          { action: "banner_only", banner_url },
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
      error: `Failed to update banner`,
    };
  }
}
