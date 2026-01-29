import { getUser } from "@/modules/common/authentication/firebase/action";
import { defineAbilityFor, Action, Subject } from "../abilities/define-ability";

export async function checkRouteAccess(
  action: Action,
  subject: Subject,
): Promise<boolean> {
  const userData = await getUser();

  if (!userData || !userData.roles || userData.roles.length === 0) {
    return false;
  }

  const ability = defineAbilityFor(userData.roles, userData.dbUser.id);
  return ability.can(action, subject);
}
