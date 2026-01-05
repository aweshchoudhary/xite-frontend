"use server";
import { Action, Resource } from "..";
import { hasPermission } from "./check-permission";
import { getUserRole } from "./get-user-role-server";

export async function checkPermission(
  resource: Resource,
  action: Action
): Promise<boolean> {
  const userRoles = await getUserRole();
  return hasPermission(userRoles, resource, action);
}
