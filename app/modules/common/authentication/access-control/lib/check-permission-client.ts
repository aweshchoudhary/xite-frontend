import { hasPermission } from ".";
import { Action, Resource } from "..";
import { useAuth } from "../../firebase/use-auth-hook";

export function useHasPermission(resource: Resource, action: Action) {
  const { roles } = useAuth();
  const permission = hasPermission(roles, resource, action);

  return permission;
}
