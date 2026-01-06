import { primaryDB } from "../../prisma/connection";
import { Cohort, WorkStatus } from "../../prisma/generated/prisma";
import { PrimaryDB } from "../../prisma/types";

/**
 * Get a single cohort record by its ID
 */
export type GetRecordInput = {
  recordId: string;
  include?: PrimaryDB.CohortInclude;
  select?: PrimaryDB.CohortSelect;
};
export type GetRecordOutput = PrimaryDB.CohortGetPayload<object> | null;

export async function getRecord({
  recordId,
}: GetRecordInput): Promise<GetRecordOutput> {
  try {
    const record = await primaryDB.cohort.findUnique({
      where: { id: recordId },
    });
    return record;
  } catch (error) {
    throw error;
  }
}

/**
 * Get multiple cohort records
 */
export type GetManyRecordsInput = {
  include?: PrimaryDB.CohortInclude;
  select?: PrimaryDB.CohortSelect;
  orderBy?: PrimaryDB.CohortOrderByWithRelationInput;
  cursor?: PrimaryDB.CohortWhereUniqueInput;
  take?: number;
  skip?: number;
};
export type GetManyRecordsOutput = PrimaryDB.CohortGetPayload<object>[];

export async function getManyRecords({
  include,
  select,
  orderBy,
  cursor,
  take = 100,
  skip = 0,
}: GetManyRecordsInput): Promise<GetManyRecordsOutput> {
  try {
    const findManyInput: PrimaryDB.CohortFindManyArgs = {
      where: {},
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

    const records = await primaryDB.cohort.findMany(findManyInput);
    return records;
  } catch (error) {
    throw error;
  }
}

/**
 * Get multiple cohort records by their status
 */
export type GetManyRecordsByStatusInput = GetManyRecordsInput & {
  status: WorkStatus | "ALL";
};
export type GetManyRecordsByStatusOutput = Cohort[];

export async function getManyRecordsByStatus({
  status,
  include,
  select,
  orderBy,
  cursor,
  take = 100,
  skip = 0,
}: GetManyRecordsByStatusInput): Promise<GetManyRecordsByStatusOutput> {
  try {
    const findManyInput: PrimaryDB.CohortFindManyArgs = {
      where: { status: status === "ALL" ? undefined : status },
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

    const records = await primaryDB.cohort.findMany(findManyInput);
    return records;
  } catch (error) {
    throw error;
  }
}

