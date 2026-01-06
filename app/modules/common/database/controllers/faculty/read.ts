"use server";
import { primaryDB } from "../../prisma/connection";
import { PrimaryDB } from "../../prisma/types";

/**
 * Get a single faculty record by its ID
 */
export type GetRecordInput = {
  recordId: string;
  include?: PrimaryDB.FacultyInclude;
  select?: PrimaryDB.FacultySelect;
};
export type GetRecordOutput = PrimaryDB.FacultyGetPayload<object> | null;

export async function getRecord({
  recordId,
}: GetRecordInput): Promise<GetRecordOutput> {
  try {
    const record = await primaryDB.faculty.findUnique({
      where: { id: recordId },
    });
    return record;
  } catch (error) {
    throw error;
  }
}

/**
 * Get multiple faculty records
 */
export type GetManyRecordsInput = {
  where?: PrimaryDB.FacultyWhereInput;
  include?: PrimaryDB.FacultyInclude;
  select?: PrimaryDB.FacultySelect;
  orderBy?: PrimaryDB.FacultyOrderByWithRelationInput;
  cursor?: PrimaryDB.FacultyWhereUniqueInput;
  take?: number;
  skip?: number;
};
export type GetManyRecordsOutput = PrimaryDB.FacultyGetPayload<object>[];

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
    const findManyInput: PrimaryDB.FacultyFindManyArgs = {
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

    const records = await primaryDB.faculty.findMany(findManyInput);
    return records;
  } catch (error) {
    throw error;
  }
}

