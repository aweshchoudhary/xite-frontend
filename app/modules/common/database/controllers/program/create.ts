import { primaryDB } from "../../prisma/connection";
import { PrimaryDB } from "../../prisma/types";

export type CreateRecordInput = PrimaryDB.ProgramCreateInput;
export type CreateRecordOutput = PrimaryDB.ProgramGetPayload<object>;

export async function createRecord(
  data: CreateRecordInput
): Promise<CreateRecordOutput> {
  try {
    const createdData = await primaryDB.program.create({ data });
    return createdData;
  } catch (error) {
    throw error;
  }
}
