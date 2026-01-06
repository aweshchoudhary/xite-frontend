import { primaryDB } from "../../prisma/connection";
import { Faculty } from "../../prisma/generated/prisma";

export type DeleteRecordInput = {
  recordId: string;
};
export type DeleteRecordOutput = Faculty;

export async function deleteRecord({
  recordId,
}: DeleteRecordInput): Promise<DeleteRecordOutput> {
  try {
    const deletedData = await primaryDB.faculty.delete({
      where: { id: recordId },
    });
    return deletedData;
  } catch (error) {
    throw error;
  }
}

export type DeleteManyRecordsInput = {
  recordIds: string[];
};
export type DeleteManyRecordsOutput = number;

export async function deleteManyRecords({
  recordIds,
}: DeleteManyRecordsInput): Promise<DeleteManyRecordsOutput> {
  try {
    const deletedData = await primaryDB.faculty.deleteMany({
      where: { id: { in: recordIds } },
    });
    return deletedData.count;
  } catch (error) {
    throw error;
  }
}

