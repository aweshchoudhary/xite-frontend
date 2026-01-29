"use server";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { PrimaryDB } from "@/modules/common/database/prisma/types";

type GetAllUsersOutput = {
  error?: string;
  data?: PrimaryDB.UserGetPayload<{
    include: { roles: true };
  }>[];
};

type GetOneUserOutput = {
  error?: string;
  data?: PrimaryDB.UserGetPayload<{
    include: { roles: true };
  }>;
};

export async function getAllUsers(): Promise<GetAllUsersOutput> {
  try {
    const users = await primaryDB.user.findMany({
      include: {
        roles: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { data: users };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch users" };
  }
}

export async function getOneUser(id: string): Promise<GetOneUserOutput> {
  try {
    const user = await primaryDB.user.findUnique({
      where: { id },
      include: {
        roles: true,
      },
    });

    if (!user) {
      return { error: "User not found" };
    }

    return { data: user };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch user" };
  }
}

export async function getAllRoles() {
  try {
    const roles = await primaryDB.userRole.findMany({
      orderBy: {
        role: "asc",
      },
    });

    return { data: roles };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch roles" };
  }
}
