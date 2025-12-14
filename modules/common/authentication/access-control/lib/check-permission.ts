import { Action, permissions, Resource } from "../index";
import { UserRole } from "@/modules/common/database/prisma";

export function hasPermission(
  userRoles: UserRole[] | undefined,
  resource: Resource,
  action: Action
): boolean {
  if (!userRoles || userRoles.length === 0) return false;

  return userRoles.some((role) => {
    const rolePermissions = permissions[role.role as keyof typeof permissions];
    const actions = rolePermissions?.[resource as keyof typeof rolePermissions];
    return actions?.includes(action) ?? false;
  });
}
