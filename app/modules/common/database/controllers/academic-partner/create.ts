import { primaryDB } from "../../prisma/connection";
import { PrimaryDB } from "../../prisma/types";

export type CreateRecordInput = PrimaryDB.AcademicPartnerCreateInput;
export type CreateRecordOutput = PrimaryDB.AcademicPartnerGetPayload<object>;

export async function createRecord(
  data: CreateRecordInput
): Promise<CreateRecordOutput> {
  try {
    const createdData = await primaryDB.academicPartner.create({ data });
    return createdData;
  } catch (error) {
    throw error;
  }
}

