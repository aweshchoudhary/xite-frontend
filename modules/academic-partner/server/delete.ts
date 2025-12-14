"use server";
import { PrimaryDB, primaryDB } from "@/modules/common/database";

export type DeleteOneOutput = PrimaryDB.AcademicPartnerGetPayload<object>;

export async function deleteOne({
  id,
}: {
  id: string;
}): Promise<DeleteOneOutput> {
  try {
    const deletedData = await primaryDB.academicPartner.delete({
      where: { id },
    });

    return deletedData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
