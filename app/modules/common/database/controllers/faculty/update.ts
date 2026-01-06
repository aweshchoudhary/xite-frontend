import { primaryDB } from "../../prisma/connection";
import { PrimaryDB } from "../../prisma/types";

export type UpdateRecordInput = {
  recordId: string;
  data: PrimaryDB.FacultyUpdateInput;
};
export type UpdateRecordOutput = PrimaryDB.FacultyGetPayload<object>;

export async function updateRecord({
  recordId,
  data,
}: UpdateRecordInput): Promise<UpdateRecordOutput> {
  try {
    const updatedData = await primaryDB.faculty.update({
      where: { id: recordId },
      data,
    });
    return updatedData;
  } catch (error) {
    throw error;
  }
}

