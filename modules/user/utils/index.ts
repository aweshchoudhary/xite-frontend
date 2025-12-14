"use server";
import { auth } from "@/modules/common/authentication";
import { primaryDB } from "@/modules/common/database";

export const isUserAdmin = async () => {
  const session = await auth();
  return session?.user?.roles?.some((role) => role.role === "Admin");
};

export const getLoggedInUser = async () => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized: No user found");
  }

  return session?.user;
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
  return cohort?.ownerId === user.id;
};
