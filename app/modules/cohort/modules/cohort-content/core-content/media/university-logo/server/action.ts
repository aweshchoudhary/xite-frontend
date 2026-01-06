"use server";

import { primaryDB } from "@/modules/common/database/prisma/connection";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant/errors";
import { uploadFile } from "@/modules/common/services/file-upload";
import { revalidatePath } from "next/cache";

export async function updateUniversityLogoAction(cohortId: string, logo: File) {
  try {
    const permission = await checkPermission("Cohort", "update");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const { fileUrl: logo_url } = await uploadFile(logo);

    const cohort = await primaryDB.cohort.update({
      where: { id: cohortId },
      data: {
        media_section: {
          update: {
            university_logo_url: logo_url,
          },
        },
      },
    });

    if (!cohort) {
      throw new Error("Failed to update university logo");
    }

    revalidatePath(`/cohorts/${cohortId}`);
    revalidatePath(`/cohorts/${cohortId}/edit`);
    revalidatePath(`/cohorts/${cohortId}`);
  } catch (error) {
    throw error;
  }
}
