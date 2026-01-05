"use server";

import { globalSearchRead } from "../data-access/read";

export async function globalSearchAction(query: string) {
  try {
    const data = await globalSearchRead({ query });

    return data;
  } catch (error) {
    throw error;
  }
}
