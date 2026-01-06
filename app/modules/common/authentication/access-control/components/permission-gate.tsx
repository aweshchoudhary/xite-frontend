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
  const { roles, loading } = useAuth();

  // Don't render anything while loading to avoid flash of content
  if (loading) return null;

  // If no roles, user is not authenticated or has no permissions
  if (!roles || roles.length === 0) return null;

  const allowed = hasPermission(roles, resource, action);

  return allowed ? <>{children}</> : null;
}
