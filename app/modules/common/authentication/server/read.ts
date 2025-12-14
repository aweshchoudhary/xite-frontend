import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";

export type GetUserRoles = PrimaryDB.UserRoleGetPayload<object>[];

export type GetUserRolesInput = {
  userId: string;
};

export type GetUserRolesOutput = {
  data?: PrimaryDB.UserRoleGetPayload<object>[];
  error?: string;
};

export async function getUserRoles({
  userId,
}: GetUserRolesInput): Promise<GetUserRolesOutput> {
  try {
    const newData = await primaryDB.userRole.findMany({
      where: {
        users: {
          some: { id: userId },
        },
      },
    });

    if (!newData) {
      throw new Error(`Failed to get user roles`);
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
