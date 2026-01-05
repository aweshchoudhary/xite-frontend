"use server";
import { deleteCohort } from "@/modules/cohort/server/cohort/delete";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant";
import { revalidatePath } from "next/cache";

export async function deleteCohortAction(cohortId: string) {
  try {
    const permission = await checkPermission("Cohort", "delete");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const cohort = await deleteCohort({ cohortId });

    if (!cohort) {
      throw new Error("Failed to delete cohort");
    }

    revalidatePath("/cohorts");
    revalidatePath("/programs");
  } catch (error) {
    throw error;
  }
}
