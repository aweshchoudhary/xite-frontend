"use server";
import { CreateSchema } from "./schema";
import { revalidatePath } from "next/cache";

export async function createProgramAction(
  data: CreateSchema
): Promise<void> {
  try {
    console.log("data", data);

    revalidatePath("/programs");

    // return program;
  } catch (error) {
    throw error;
  }
}