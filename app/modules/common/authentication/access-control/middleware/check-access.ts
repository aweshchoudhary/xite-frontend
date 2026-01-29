import { getUserRoles } from "@/modules/common/authentication/firebase/action";
import { defineAbilityFor, Action, Subject } from "../abilities/define-ability";

export async function checkAccess(
  action: Action,
  subject: Subject,
): Promise<boolean> {
  const roles = await getUserRoles();

  if (!roles || roles.length === 0) {
    return false;
  }

  const ability = defineAbilityFor(roles);
  return ability.can(action, subject);
}

export async function requireAccess(action: Action, subject: Subject) {
  const hasAccess = await checkAccess(action, subject);

  if (!hasAccess) {
    throw new Error(`Unauthorized: Cannot ${action} ${subject}`);
  }
}
