"use client";

import { hasPermission } from "../lib/check-permission";
import { Action, Resource } from "../index";
import { useAuth } from "../../firebase/use-auth-hook";

interface Props {
  resource: Resource;
  action: Action;
  children: React.ReactNode;
}

export default function PermissionGate({ resource, action, children }: Props) {
  const { user, roles } = useAuth();

  if (!user || roles.length === 0) return null;

  const allowed = hasPermission(roles, resource, action);

  return allowed ? <>{children}</> : null;
}
