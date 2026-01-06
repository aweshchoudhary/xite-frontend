import { primaryDB } from "../../prisma/connection";
import { PrimaryDB } from "../../prisma/types";

export type CreateRecordInput = PrimaryDB.TopicCreateInput;
export type CreateRecordOutput = PrimaryDB.TopicGetPayload<object>;

export async function createRecord(
  data: CreateRecordInput
): Promise<CreateRecordOutput> {
  try {
    const createdData = await primaryDB.topic.create({ data });
    return createdData;
  } catch (error) {
    throw error;
  }
}

