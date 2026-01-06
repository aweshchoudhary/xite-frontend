import { hasPermission } from ".";
import { Action, Resource } from "..";
import { useAuth } from "../../firebase/use-auth-hook";

export function useHasPermission(resource: Resource, action: Action) {
  const { roles, loading } = useAuth();
  
  // Return false while loading to prevent premature access
  if (loading || !roles || roles.length === 0) {
    return false;
  }
  
  return hasPermission(roles, resource, action);
}
