import { auth } from "@/modules/common/authentication/authjs/connection";
import { primaryDB } from "@/modules/common/database/prisma/connection";

export async function authCallbackAction() {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user) {
      throw new Error("User not found");
    }

    await primaryDB.user.update({
      where: { id: user?.id },
      data: {
        name: user?.name || user?.email?.split("@")[0].split(".").join(" "),
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
