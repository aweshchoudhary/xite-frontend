"use client";
import { useEffect, useState } from "react";
import { getCohortByIdAction } from "./actions";
import { useAuth } from "@/modules/common/authentication/firebase/use-auth-hook";

export const useCheckUserOwnsCohort = (cohortId: string): boolean => {
  const [hasAccess, setHasAccess] = useState(false);
  const user = useAuth();

  useEffect(() => {
    const handleCheckUserOwnsCohort = async () => {
      if (!user) return false;

      // const isAdmin = user.roles?.some((role) => role.role === "Admin");
      const isAdmin = true;
      if (isAdmin) {
        setHasAccess(true);
        return;
      }

      const cohort = await getCohortByIdAction(cohortId);
      if (cohort.ownerId === user?.uid) {
        setHasAccess(true);
      }
    };

    handleCheckUserOwnsCohort();
  }, [cohortId]);

  return hasAccess;
};
