"use client";

import { useAbility } from "./use-ability";
import { Action, Subject } from "../abilities/define-ability";

export function useCan(action: Action, subject: Subject) {
  const { ability, loading } = useAbility();

  if (loading || !ability) {
    return false;
  }

  return ability.can(action, subject);
}
