"use client";
import { useEffect, useState } from "react";
import { getUser } from "./action";
import { User, UserRole } from "../../database/prisma/generated/prisma";
import { User as DbUser } from "../../database/prisma/generated/prisma";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      if (user) {
        setUser(user.user.toJSON() as User);
        setRoles(user.roles);
        setDbUser(user.dbUser);
      }
    };
    fetchUser();
  }, []);

  return { user, roles, dbUser };
};
