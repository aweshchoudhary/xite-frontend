"use client";
import { useEffect, useState } from "react";
import { getUser } from "./action";
import { UserRecord } from "firebase-admin/auth";

export const useAuth = () => {
  const [user, setUser] = useState<UserRecord | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  return user;
};
