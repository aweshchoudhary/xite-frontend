"use client";
import { useEffect, useState } from "react";
import { getUser } from "./action";
import { User, UserRole } from "../../database/prisma/generated/prisma";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
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
