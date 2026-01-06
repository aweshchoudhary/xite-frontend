"use server";

import { primaryDB } from "@/modules/common/database/prisma/connection";

export async function getProgramTagsAction() {
  try {
    const data = await primaryDB.programTag.findMany({
      orderBy: { name: "asc" },
    });
    return data || [];
  } catch (error) {
    console.error("Failed to fetch program tags:", error);
    return [];
  }
}


