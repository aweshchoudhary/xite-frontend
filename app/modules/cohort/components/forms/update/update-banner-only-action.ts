"use server";

import { primaryDB } from "@/modules/common/database/prisma/connection";
import { revalidatePath } from "next/cache";
import { uploadFile } from "@/modules/common/services/file-upload";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant";

/**
 * Update only the banner image of a cohort
 */
export type UpdateBannerOnlyOutput = {
  success: boolean;
  error?: string;
};

export async function updateBannerOnlyAction(
  cohortId: string,
  banner: File
): Promise<UpdateBannerOnlyOutput> {
  try {
    const permission = await checkPermission("Cohort", "update");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const { fileUrl: banner_url } = await uploadFile(banner);

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

