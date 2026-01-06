"use server";
import { primaryDB } from "../../prisma/connection";
import { PrimaryDB } from "../../prisma/types";

export type CreateRecordInput = PrimaryDB.EnterpriseCreateInput;
export type CreateRecordOutput = PrimaryDB.EnterpriseGetPayload<object>;

export async function createRecord(
  data: CreateRecordInput
): Promise<CreateRecordOutput> {
  try {
    const createdData = await primaryDB.enterprise.create({ data });
    return createdData;
  } catch (error) {
    throw error;
  }
}

