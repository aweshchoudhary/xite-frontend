"use server";
import { MODULE_PATH } from "@/modules/program/contants";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { revalidatePath } from "next/cache";
import { requireAccess } from "@/modules/common/authentication/access-control/middleware/check-access";
import { logDelete } from "@/modules/common/lib/audit-logger";
import { getAuthUser } from "@/modules/common/authentication/firebase/action";

export async function deleteOneAction(programId: string) {
  try {
    await requireAccess("delete", "Program");

    // Get program data before deletion for audit log
    const programToDelete = await primaryDB.program.findUnique({
      where: { id: programId },
    });

    if (!programToDelete) {
      throw new Error("Program not found");
    }

    const deletedData = await primaryDB.program.delete({
      where: { id: programId },
    });

    // Log the audit entry
    try {
      const user = await getAuthUser();
      if (user) {
        await logDelete(
          user.uid,
          user.name || user.email || "Unknown User",
          "Program",
          deletedData.id,
          programToDelete.name,
          "postgresql",
          programToDelete,
        );
      }
    } catch (auditError) {
      console.error("Failed to create audit log:", auditError);
    }

    revalidatePath(MODULE_PATH);

    return deletedData;
  } catch (error) {
    throw error;
  }
}
