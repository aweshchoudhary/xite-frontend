"use server";

import { cookies } from "next/headers";
import { adminAuth } from "./auth";
import { redirect } from "next/navigation";
import { primaryDB } from "../../database/prisma/connection";
import { UserRole } from "../../database/prisma/generated/prisma";
import { User } from "firebase/auth";
import { getCache, setCache } from "../../services/redis/controllers";

export async function loginAction(idToken: string) {
  // 1. Verify the token with Firebase Admin
  const decodedToken = await adminAuth.verifyIdToken(idToken);
  const email = decodedToken.email;

  // 2. SERVER-SIDE SECURITY CHECK
  if (!email?.endsWith("@xedinstitute.org")) {
    throw new Error("Unauthorized: Organization email required.");
  }

  // 2.2 create user in prisma database if not exists
  const user = await primaryDB.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) {
    await primaryDB.user.create({
      data: {
        email: email,
        name: decodedToken.name,
        image: decodedToken.picture,
        roles: {
          connectOrCreate: {
            where: {
              role: "User",
            },
            create: {
              role: "User",
            },
          },
        },
      },
    });
  }

  // 3. Create a Session Cookie (expires in 5 days)
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn,
  });

  // 4. Set the cookie in the browser
  const cookieStore = await cookies();
  cookieStore.set("session", sessionCookie, {
    maxAge: expiresIn,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  // 5. Redirect
  redirect("/");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/login");
}

export async function getUser(): Promise<{
  user: User;
  roles: UserRole[];
} | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session) return null;

  // 1️⃣ Verify session
  const decodedToken = await adminAuth.verifySessionCookie(session.value);
  const uid = decodedToken.uid;

  // 2️⃣ Session-aware cache key
  const cacheKey = `auth:user:${uid}`;

  // 3️⃣ Check Redis
  const cached = await getCache<{
    user: User;
    roles: UserRole[];
  }>(cacheKey);

  if (cached) {
    return cached;
  }

  // 4️⃣ Fetch from Firebase
  const user = await adminAuth.getUser(uid);

  // 5️⃣ Fetch roles from DB
  const dbUser = await primaryDB.user.findUnique({
    where: { email: user.email },
    select: { roles: true },
  });

  if (!dbUser || !dbUser.roles) return null;

  const payload = {
    user: user.toJSON() as User,
    roles: dbUser.roles,
  };

  // 6️⃣ Cache (short TTL is enough)
  await setCache(cacheKey, payload, 300); // 5 minutes

  return payload;
}

export async function getUserRoles(): Promise<UserRole[]> {
  const data = await getUser();
  return data?.roles ?? [];
}
