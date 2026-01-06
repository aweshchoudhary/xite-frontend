"use server";
import { primaryDB } from "../../prisma/connection";
import { PrimaryDB } from "../../prisma/types";

/**
 * Get a single topic record by its ID
 */
export type GetRecordInput = {
  recordId: string;
  include?: PrimaryDB.TopicInclude;
  select?: PrimaryDB.TopicSelect;
};
export type GetRecordOutput = PrimaryDB.TopicGetPayload<object> | null;

export async function getRecord({
  recordId,
}: GetRecordInput): Promise<GetRecordOutput> {
  try {
    const record = await primaryDB.topic.findUnique({
      where: { id: recordId },
    });
    return record;
  } catch (error) {
    throw error;
  }
}

/**
 * Get multiple topic records
 */
export type GetManyRecordsInput = {
  where?: PrimaryDB.TopicWhereInput;
  include?: PrimaryDB.TopicInclude;
  select?: PrimaryDB.TopicSelect;
  orderBy?: PrimaryDB.TopicOrderByWithRelationInput;
  cursor?: PrimaryDB.TopicWhereUniqueInput;
  take?: number;
  skip?: number;
};
export type GetManyRecordsOutput = PrimaryDB.TopicGetPayload<object>[];

export async function getManyRecords({
  where,
  include,
  select,
  orderBy,
  cursor,
  take = 100,
  skip = 0,
}: GetManyRecordsInput): Promise<GetManyRecordsOutput> {
  try {
    const findManyInput: PrimaryDB.TopicFindManyArgs = {
      where: where || {},
      orderBy,
      cursor,
      take,
      skip,
    };

    if (include) {
      findManyInput.include = include;
    }
    if (select) {
      findManyInput.select = select;
    }

    const records = await primaryDB.topic.findMany(findManyInput);
    return records;
  } catch (error) {
    throw error;
  }
}

