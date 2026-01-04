"use server";

import { updateCohort } from "@/modules/cohort/server/cohort/update";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant/errors";
import { uploadFile } from "@/modules/common/services/file-upload";
import { getLoggedInUser } from "@/modules/user/utils";
import { revalidatePath } from "next/cache";

export async function updateUniversityLogoAction(
  cohortId: string,
  universityLogo: File
) {
  try {
    const permission = await checkPermission("Cohort", "update");
    const currentUser = await getLoggedInUser();
    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const { fileUrl: university_logo_url } = await uploadFile(universityLogo);

    const cohort = await updateCohort({
      cohortId,
      data: {
        media_section: {
          update: {
            university_logo_url: university_logo_url,
          },
        },
        updated_by: {
          connect: {
            id: currentUser?.dbUser?.id,
          },
        },
      },
    });

    if (!cohort) {
      throw new Error("Failed to update cohort");
    }

    revalidatePath(`/cohorts/${cohortId}`);
    revalidatePath(`/cohorts/${cohortId}/edit`);
    revalidatePath(`/cohorts/${cohortId}`);
  } catch (error) {
    throw error;
  }
}
