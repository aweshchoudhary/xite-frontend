import { PrimaryDB } from "@/modules/common/database";
import { prisma } from "@/modules/common/database/prisma/connection";

export type CreateUserRole = PrimaryDB.UserRoleGetPayload<object>;

export type CreateUserRoleInput = {
  data: PrimaryDB.UserRoleCreateInput;
};

export type CreateUserRoleOutput = {
  data?: PrimaryDB.UserRoleGetPayload<object>;
  error?: string;
};

export async function upsertUserRole({
  data,
}: CreateUserRoleInput): Promise<CreateUserRoleOutput> {
  try {
    const existingRole = await prisma.userRole.findFirst({
      where: {
        role: data.role,
      },
    });

    if (existingRole) {
      const updatedData = await prisma.userRole.update({
        where: {
          id: existingRole.id,
        },
        data,
      });
      return {
        data: updatedData,
      };
    }

    const newData = await prisma.userRole.create({
      data,
    });

    if (!newData) {
      throw new Error(`Failed to create user role`);
    }

    return {
      data: newData,
    };
  } catch (error) {
    console.error(error);
    return {
      error: `Failed to create user role`,
    };
  }
}
