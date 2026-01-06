"use server";
import { primaryDB } from "../../prisma/connection";
import { PrimaryDB } from "../../prisma/types";

/**
 * Get a single enterprise record by its ID
 */
export type GetRecordInput = {
  recordId: string;
  include?: PrimaryDB.EnterpriseInclude;
  select?: PrimaryDB.EnterpriseSelect;
};
export type GetRecordOutput = PrimaryDB.EnterpriseGetPayload<object> | null;

export async function getRecord({
  recordId,
}: GetRecordInput): Promise<GetRecordOutput> {
  try {
    const record = await primaryDB.enterprise.findUnique({
      where: { id: recordId },
    });
    return record;
  } catch (error) {
    throw error;
  }
}

/**
 * Get multiple enterprise records
 */
export type GetManyRecordsInput = {
  where?: PrimaryDB.EnterpriseWhereInput;
  include?: PrimaryDB.EnterpriseInclude;
  select?: PrimaryDB.EnterpriseSelect;
  orderBy?: PrimaryDB.EnterpriseOrderByWithRelationInput;
  cursor?: PrimaryDB.EnterpriseWhereUniqueInput;
  take?: number;
  skip?: number;
};
export type GetManyRecordsOutput = PrimaryDB.EnterpriseGetPayload<object>[];

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
    const findManyInput: PrimaryDB.EnterpriseFindManyArgs = {
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

    const records = await primaryDB.enterprise.findMany(findManyInput);
    return records;
  } catch (error) {
    throw error;
  }
}

