"use server";
import { primaryDB } from "../../prisma/connection";
import { Program, ProgramStatus } from "../../prisma/generated/prisma";
import { PrimaryDB } from "../../prisma/types";

/**
 * Get a single program record by its ID
 */
export type GetRecordInput = {
  recordId: string;
  include?: PrimaryDB.ProgramInclude;
  select?: PrimaryDB.ProgramSelect;
};
export type GetRecordOutput = PrimaryDB.ProgramGetPayload<object> | null;

export async function getRecord({
  recordId,
}: GetRecordInput): Promise<GetRecordOutput> {
  try {
    const record = await primaryDB.program.findUnique({
      where: { id: recordId },
    });
    return record;
  } catch (error) {
    throw error;
  }
}

/**
 * Get multiple program records
 */
export type GetManyRecordsInput = {
  include?: PrimaryDB.ProgramInclude;
  select?: PrimaryDB.ProgramSelect;
  orderBy?: PrimaryDB.ProgramOrderByWithRelationInput;
  cursor?: PrimaryDB.ProgramWhereUniqueInput;
  take?: number;
  skip?: number;
};
export type GetManyRecordsOutput = PrimaryDB.ProgramGetPayload<object>[];

export async function getManyRecords({
  include,
  select,
  orderBy,
  cursor,
  take = 100,
  skip = 0,
}: GetManyRecordsInput): Promise<GetManyRecordsOutput> {
  try {
    const findManyInput: PrimaryDB.ProgramFindManyArgs = {
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

    const records = await primaryDB.program.findMany(findManyInput);
    return records;
  } catch (error) {
    throw error;
  }
}

/**
 * Get multiple program records by their status
 */
export type GetManyRecordsByStatusInput = GetManyRecordsInput & {
  status: ProgramStatus | "ALL";
};
export type GetManyRecordsByStatusOutput = Program[];

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
    const findManyInput: PrimaryDB.ProgramFindManyArgs = {
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

    const records = await primaryDB.program.findMany(findManyInput);
    return records;
  } catch (error) {
    throw error;
  }
}
