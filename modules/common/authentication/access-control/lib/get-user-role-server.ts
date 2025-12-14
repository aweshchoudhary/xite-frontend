"use server";
import { UserRole } from "@/modules/common/database/prisma/generated/prisma";
import { auth } from "../../authjs/connection";

export async function getUserRole(): Promise<UserRole[]> {
  return [
    { role: "Admin", id: "1", created_at: new Date(), updated_at: new Date() },
  ];
}
