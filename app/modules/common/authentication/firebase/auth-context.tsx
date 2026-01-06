"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { getUser } from "./action";
import { UserRole } from "../../database/prisma/generated/prisma";
import { User as DbUser } from "../../database/prisma/generated/prisma";
import { UserRecord } from "firebase-admin/auth";

interface AuthContextType {
  user: UserRecord | null;
  roles: UserRole[];
  dbUser: DbUser | null;
  loading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserRecord | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const userData = await getUser();
        
        if (!mounted) return;
        
        if (userData) {
          setUser(userData.user);
          setRoles(userData.roles);
          setDbUser(userData.dbUser);
        } else {
          setUser(null);
          setRoles([]);
          setDbUser(null);
        }
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err : new Error("Failed to fetch user"));
        setUser(null);
        setRoles([]);
        setDbUser(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      roles,
      dbUser,
      loading,
      error,
    }),
    [user, roles, dbUser, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

