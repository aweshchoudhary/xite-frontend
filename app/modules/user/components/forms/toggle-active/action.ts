"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { ToggleActiveSchema } from "../schema";
import { revalidatePath } from "next/cache";
import { MODULE_NAME, MODULE_PATH } from "@/modules/user/contants";
import { requireAccess } from "@/modules/common/authentication/access-control/middleware/check-access";
import { logUpdate } from "@/modules/common/lib/audit-logger";
import { getAuthUser } from "@/modules/common/authentication/firebase/action";

type ToggleActiveActionOutput = {
  error?: string;
  data?: PrimaryDB.UserGetPayload<object>;
};

export async function toggleActiveAction(
  data: ToggleActiveSchema,
): Promise<ToggleActiveActionOutput> {
  try {
    await requireAccess("update", "User");

    const { id, isActive } = data;

    // Get initial data for audit log
    const initialData = await primaryDB.user.findUnique({
      where: { id },
      include: { roles: true },
    });

    if (!initialData) {
      return { error: "User not found" };
    }

    const updatedData = await primaryDB.user.update({
      where: { id },
      data: { isActive },
      include: { roles: true },
    });

    if (!updatedData) {
      throw new Error(
        `Failed to ${isActive ? "activate" : "deactivate"} ${MODULE_NAME}`,
      );
    }

    // Log the audit entry
    try {
      const user = await getAuthUser();
      if (user) {
        await logUpdate(
          user.uid,
          user.name || user.email || "Unknown User",
          "User",
          updatedData.id,
          `${isActive ? "Activated" : "Deactivated"} ${updatedData.name || updatedData.email || "Unknown"}`,
          "postgresql",
          initialData,
          updatedData,
        );
      }
    } catch (auditError) {
      console.error("Failed to create audit log:", auditError);
    }

    revalidatePath(MODULE_PATH);

    return { data: updatedData };
  } catch (error) {
    console.error(error);
    return {
      error: `Failed to ${isActive ? "activate" : "deactivate"} ${MODULE_NAME}`,
    };
  }
}
