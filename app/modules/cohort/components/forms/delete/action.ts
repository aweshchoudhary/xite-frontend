"use server";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { requireAccess } from "@/modules/common/authentication/access-control/middleware/check-access";
import { revalidatePath } from "next/cache";
import { logDelete } from "@/modules/common/lib/audit-logger";
import { getAuthUser } from "@/modules/common/authentication/firebase/action";

export async function deleteCohortAction(cohortId: string) {
  try {
    await requireAccess("delete", "Cohort");

    // Get cohort data before deletion for audit log
    const cohortToDelete = await primaryDB.cohort.findUnique({
      where: { id: cohortId },
      include: { fees: true },
    });

    if (!cohortToDelete) {
      throw new Error("Cohort not found");
    }

    const cohort = await primaryDB.cohort.delete({
      where: { id: cohortId },
    });

    if (!cohort) {
      throw new Error("Failed to delete cohort");
    }

    // Log the audit entry
    try {
      const user = await getAuthUser();
      if (user) {
        await logDelete(
          user.uid,
          user.name || user.email || "Unknown User",
          "Cohort",
          cohort.id,
          cohortToDelete.cohort_name,
          "postgresql",
          cohortToDelete,
        );
      }
    } catch (auditError) {
      // Don't fail the main operation if audit logging fails
      console.error("Failed to create audit log:", auditError);
    }

    revalidatePath("/cohorts");
    revalidatePath("/programs");
  } catch (error) {
    throw error;
  }
}
