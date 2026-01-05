"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";

export type DeleteOneOutput = PrimaryDB.FacultyGetPayload<object>;

export async function deleteOne({ id }: { id: string }) {
  try {
    return await primaryDB.faculty.delete({
      where: { id },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
