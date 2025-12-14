"use client";
import { useEffect, useState } from "react";
import { getCohortByIdAction } from "./actions";
import { useAuth } from "@/modules/common/authentication/firebase/use-auth-hook";

export const useCheckUserOwnsCohort = (cohortId: string): boolean => {
  const [hasAccess, setHasAccess] = useState(false);
  const session = useAuth();

  useEffect(() => {
    const handleCheckUserOwnsCohort = async () => {
      if (!session?.dbUser) return false;

      // const isAdmin = user.roles?.some((role) => role.role === "Admin");
      const isAdmin = true;
      if (isAdmin) {
        setHasAccess(true);
        return;
      }

      const cohort = await getCohortByIdAction(cohortId);
      if (cohort.ownerId === session?.dbUser?.id) {
        setHasAccess(true);
      }
    };

    handleCheckUserOwnsCohort();
  }, [cohortId, session?.dbUser]);

  return hasAccess;
};
