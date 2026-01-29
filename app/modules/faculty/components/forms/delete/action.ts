"use server";
import { MODULE_NAME, MODULE_PATH } from "@/modules/faculty/contants";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { revalidatePath } from "next/cache";
import { requireAccess } from "@/modules/common/authentication/access-control/middleware/check-access";
import { logDelete } from "@/modules/common/lib/audit-logger";
import { getAuthUser } from "@/modules/common/authentication/firebase/action";

type DeleteActionOutput = {
  error?: string;
  data?: PrimaryDB.FacultyGetPayload<object>;
};

export async function deleteAction(id: string): Promise<DeleteActionOutput> {
  try {
    await requireAccess("delete", "Faculty");

    // Get data before deletion for audit log
    const dataToDelete = await primaryDB.faculty.findUnique({
      where: { id },
    });

    if (!dataToDelete) {
      throw new Error("Faculty not found");
    }

    const deletedData = await primaryDB.faculty.delete({
      where: { id: id },
    });

    // Log the audit entry
    try {
      const user = await getAuthUser();
      if (user) {
        await logDelete(
          user.uid,
          user.name || user.email || "Unknown User",
          "Faculty",
          deletedData.id,
          dataToDelete.name,
          "postgresql",
          dataToDelete,
        );
      }
    } catch (auditError) {
      console.error("Failed to create audit log:", auditError);
    }

    revalidatePath(MODULE_PATH);

    return { data: deletedData };
  } catch (error) {
    console.error(error);
    return { error: `Failed to delete ${MODULE_NAME}` };
  }
}
