"use server";

import { primaryDB } from "@/modules/common/database/prisma/connection";
import { revalidatePath } from "next/cache";
import { uploadFile } from "@/modules/common/services/file-upload";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant";

/**
 * Update only the brochure of a cohort
 */
export type UpdateBrochureOnlyOutput = {
  success: boolean;
  error?: string;
};

export async function updateBrochureOnlyAction(
  cohortId: string,
  brochure: File
): Promise<UpdateBrochureOnlyOutput> {
  try {
    const permission = await checkPermission("Cohort", "update");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const { fileUrl: brochure_url } = await uploadFile(brochure);

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

