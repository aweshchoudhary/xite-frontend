"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { UpdateSchema } from "../schema";
import { revalidatePath } from "next/cache";
import { MODULE_NAME, MODULE_PATH } from "@/modules/user/contants";
import { requireAccess } from "@/modules/common/authentication/access-control/middleware/check-access";
import { logUpdate } from "@/modules/common/lib/audit-logger";
import { getAuthUser } from "@/modules/common/authentication/firebase/action";

type UpdateActionOutput = {
  error?: string;
  data?: PrimaryDB.UserGetPayload<object>;
};

export async function updateAction(
  data: UpdateSchema,
): Promise<UpdateActionOutput> {
  try {
    await requireAccess("update", "User");

    const { id, roles, ...rest } = data;

    // Get initial data for audit log
    const initialData = await primaryDB.user.findUnique({
      where: { id },
      include: { roles: true },
    });

    if (!initialData) {
      return { error: "User not found" };
    }

    // Get role IDs based on role names
    const roleRecords = await primaryDB.userRole.findMany({
      where: {
        role: {
          in: roles,
        },
      },
    });

    if (roleRecords.length !== roles.length) {
      return { error: "One or more roles are invalid" };
    }

    // Disconnect all existing roles and connect new ones
    const updatedData = await primaryDB.user.update({
      where: { id },
      data: {
        ...rest,
        roles: {
          set: [],
          connect: roleRecords.map((role) => ({ id: role.id })),
        },
      },
      include: {
        roles: true,
      },
    });

    if (!updatedData) {
      throw new Error(`Failed to update ${MODULE_NAME}`);
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
          updatedData.name || updatedData.email || "Unknown",
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
    return { error: `Failed to update ${MODULE_NAME}` };
  }
}
