"use server";

import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";

export type GetAllUsersOutput = {
  data?: PrimaryDB.UserGetPayload<{
    include: {
      roles: true;
    };
  }>[];
  error?: string;
};

export async function getAllUsersAction(): Promise<GetAllUsersOutput> {
  try {
    const data = await primaryDB.user.findMany({
      include: {
        roles: true,
      },
    });
    return { data };
  } catch (error) {
    console.error(error);
    return {
      error: `Failed to get all users`,
    };
  }
}

export type GetOneUser = PrimaryDB.UserGetPayload<{
  include: {
    roles: true;
  };
}>;

