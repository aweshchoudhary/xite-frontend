import { PrimaryDB } from "@/modules/common/database";
import { primaryDB } from "@/modules/common/database/prisma/connection";

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
    const existingRole = await primaryDB.userRole.findFirst({
      where: {
        role: data.role,
      },
    });

    if (existingRole) {
      const updatedData = await primaryDB.userRole.update({
        where: {
          id: existingRole.id,
        },
        data,
      });
      return {
        data: updatedData,
      };
    }

    const newData = await primaryDB.userRole.create({
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
