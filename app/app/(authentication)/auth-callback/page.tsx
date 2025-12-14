import { auth } from "@/modules/common/authentication/authjs/connection";
import { upsertUserRole } from "@/modules/common/authentication/server/create";
import { redirect } from "next/navigation";
import { authCallbackAction } from "./action";

export default async function AuthCallback() {
  const session = await auth();
  const user = session?.user;

  if (user && !user.roles?.length) {
    const userRole = await upsertUserRole({
      data: {
        role: "User",
        users: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    if (!userRole.data) {
      throw new Error("Failed to create user role");
    }

    await authCallbackAction();

    user.roles?.push(userRole.data);
  }

  return redirect("/");
}
