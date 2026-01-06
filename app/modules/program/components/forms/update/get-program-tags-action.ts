"use server";

import { getAllProgramTags } from "@/modules/program/server/read";

export async function getProgramTagsAction() {
  try {
    const { data } = await getAllProgramTags();
    return data || [];
  } catch (error) {
    console.error("Failed to fetch program tags:", error);
    return [];
  }
}


