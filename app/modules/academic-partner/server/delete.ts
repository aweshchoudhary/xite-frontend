"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { deleteRecord } from "@/modules/common/database/controllers/academic-partner/delete";

export type DeleteOneOutput = PrimaryDB.AcademicPartnerGetPayload<object>;

export async function deleteOne({
  id,
}: {
  id: string;
}): Promise<DeleteOneOutput> {
  try {
    const deletedData = await deleteRecord({ recordId: id });
    return deletedData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
