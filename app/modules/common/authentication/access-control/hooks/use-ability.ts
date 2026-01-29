"use client";

import { useMemo } from "react";
import { useAuth } from "@/modules/common/authentication/firebase/auth-context";
import { defineAbilityFor } from "../abilities/define-ability";

export function useAbility() {
  const { roles, dbUser, loading } = useAuth();

  const ability = useMemo(() => {
    if (loading || !roles || roles.length === 0) {
      return null;
    }
    return defineAbilityFor(roles, dbUser?.id);
  }, [roles, dbUser, loading]);

  return { ability, loading };
}
