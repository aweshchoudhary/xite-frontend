import { primaryDB } from "../../prisma/connection";
import { PrimaryDB } from "../../prisma/types";

export type CreateRecordInput = PrimaryDB.FacultyCreateInput;
export type CreateRecordOutput = PrimaryDB.FacultyGetPayload<object>;

export async function createRecord(
  data: CreateRecordInput
): Promise<CreateRecordOutput> {
  try {
    const createdData = await primaryDB.faculty.create({ data });
    return createdData;
  } catch (error) {
    throw error;
  }
}

