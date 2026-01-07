"use server";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { UpdateSchema } from "./schema";

export async function updateAction(data: UpdateSchema) {
  try {
    return await primaryDB.program.update({
      where: { program_key: data.program_key },
      data: { program_sf_key: data.program_sf_key },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
