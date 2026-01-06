"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { deleteRecord } from "@/modules/common/database/controllers/faculty/delete";

export type DeleteOneOutput = PrimaryDB.FacultyGetPayload<object>;

export async function deleteOne({ id }: { id: string }) {
  try {
    return await deleteRecord({ recordId: id });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
