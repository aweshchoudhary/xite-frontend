"use server";
import { primaryDB } from "../../prisma/connection";
import { PrimaryDB } from "../../prisma/types";

export type CreateRecordInput = PrimaryDB.CohortCreateInput;
export type CreateRecordOutput = PrimaryDB.CohortGetPayload<object>;

export async function createRecord(
  data: CreateRecordInput
): Promise<CreateRecordOutput> {
  try {
    const createdData = await primaryDB.cohort.create({ data });
    return createdData;
  } catch (error) {
    throw error;
  }
}
