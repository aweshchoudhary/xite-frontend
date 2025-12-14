"use server";
import {
  getUser,
  getUserRoles,
} from "@/modules/common/authentication/firebase/action";
import { primaryDB } from "@/modules/common/database";

export const isUserAdmin = async () => {
  const session = await getUserRoles();
  return session?.some((role) => role.role === "Admin");
};

export const getLoggedInUser = async () => {
  const user = await getUser();

  if (!user?.user) {
    throw new Error("Unauthorized: No user found");
  }

  return user;
};

export const checkUserOwnsCohort = async (cohortId: string) => {
  const isAdmin = await isUserAdmin();
  if (isAdmin) return true;

  const user = await getLoggedInUser();
  const cohort = await primaryDB.cohort.findFirst({
    where: { id: cohortId },
    select: {
      ownerId: true,
    },
  });
  return cohort?.ownerId === user?.user?.uid;
};
