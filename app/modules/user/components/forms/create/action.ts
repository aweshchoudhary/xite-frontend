"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { CreateSchema } from "../schema";
import { revalidatePath } from "next/cache";
import { MODULE_NAME, MODULE_PATH } from "@/modules/user/contants";
import { requireAccess } from "@/modules/common/authentication/access-control/middleware/check-access";
import { logCreate } from "@/modules/common/lib/audit-logger";
import { getAuthUser } from "@/modules/common/authentication/firebase/action";

type CreateActionOutput = {
  error?: string;
  data?: PrimaryDB.UserGetPayload<object>;
};

export async function createAction(
  data: CreateSchema,
): Promise<CreateActionOutput> {
  try {
    await requireAccess("create", "User");

    const { roles, ...rest } = data;

    // Check if user with email already exists
    const existingUser = await primaryDB.user.findUnique({
      where: { email: rest.email },
    });

    if (existingUser) {
      return { error: "User with this email already exists" };
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

    const createdData = await primaryDB.user.create({
      data: {
        ...rest,
        roles: {
          connect: roleRecords.map((role) => ({ id: role.id })),
        },
      },
      include: {
        roles: true,
      },
    });

    if (!createdData) {
      throw new Error(`Failed to create ${MODULE_NAME}`);
    }

    // Log the audit entry
    try {
      const user = await getAuthUser();
      if (user) {
        await logCreate(
          user.uid,
          user.name || user.email || "Unknown User",
          "User",
          createdData.id,
          createdData.name || createdData.email || "Unknown",
          "postgresql",
          createdData,
        );
      }
    } catch (auditError) {
      console.error("Failed to create audit log:", auditError);
    }

    revalidatePath(MODULE_PATH);

    return { data: createdData };
  } catch (error) {
    console.error(error);
    return { error: `Failed to create ${MODULE_NAME}` };
  }
}
