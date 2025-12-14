"use client";
import { useEffect, useState } from "react";
import { getUser } from "./action";
import { UserRecord } from "firebase-admin/auth";
import { UserRole } from "../../database";

export const useAuth = () => {
  const [user, setUser] = useState<UserRecord | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      if (user) {
        setUser(user.user);
        setRoles(user.roles);
      }
    };
    fetchUser();
  }, []);

  return { user, roles };
};
