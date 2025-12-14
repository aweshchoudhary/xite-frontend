import { Action, Resource } from "..";
import { useAuth } from "../../firebase/use-auth-hook";

export function useHasPermission(resource: Resource, action: Action) {
  const user = useAuth();
  // const permission = hasPermission(session.data?.user?.roles, resource, action);
  const permission = true;

  return permission;
}
