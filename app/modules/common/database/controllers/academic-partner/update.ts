import { primaryDB } from "../../prisma/connection";
import { PrimaryDB } from "../../prisma/types";

export type UpdateRecordInput = {
  recordId: string;
  data: PrimaryDB.AcademicPartnerUpdateInput;
};
export type UpdateRecordOutput = PrimaryDB.AcademicPartnerGetPayload<object>;

export async function updateRecord({
  recordId,
  data,
}: UpdateRecordInput): Promise<UpdateRecordOutput> {
  try {
    const updatedData = await primaryDB.academicPartner.update({
      where: { id: recordId },
      data,
    });
    return updatedData;
  } catch (error) {
    throw error;
  }
}

