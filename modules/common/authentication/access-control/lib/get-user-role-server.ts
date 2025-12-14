"use server";
import { UserRole } from "@/modules/common/database";
import { getUserRoles } from "../../firebase/action";

export async function getUserRole(): Promise<UserRole[]> {
  const roles = await getUserRoles();
  return roles ?? [];
}
