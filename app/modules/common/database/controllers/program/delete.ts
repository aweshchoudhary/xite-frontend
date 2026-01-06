"use server";
import { primaryDB } from "../../prisma/connection";
import { Program } from "../../prisma/generated/prisma";

export type DeleteRecordInput = {
  recordId: string;
};
export type DeleteRecordOutput = Program;

export async function deleteRecord({
  recordId,
}: DeleteRecordInput): Promise<DeleteRecordOutput> {
  try {
    const deletedData = await primaryDB.program.delete({
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
    const deletedData = await primaryDB.program.deleteMany({
      where: { id: { in: recordIds } },
    });
    return deletedData.count;
  } catch (error) {
    throw error;
  }
}
