"use server";
import { primaryDB } from "../../prisma/connection";
import { PrimaryDB } from "../../prisma/types";

/**
 * Get a single academic partner record by its ID
 */
export type GetRecordInput = {
  recordId: string;
  include?: PrimaryDB.AcademicPartnerInclude;
  select?: PrimaryDB.AcademicPartnerSelect;
};
export type GetRecordOutput = PrimaryDB.AcademicPartnerGetPayload<object> | null;

export async function getRecord({
  recordId,
}: GetRecordInput): Promise<GetRecordOutput> {
  try {
    const record = await primaryDB.academicPartner.findUnique({
      where: { id: recordId },
    });
    return record;
  } catch (error) {
    throw error;
  }
}

/**
 * Get multiple academic partner records
 */
export type GetManyRecordsInput = {
  where?: PrimaryDB.AcademicPartnerWhereInput;
  include?: PrimaryDB.AcademicPartnerInclude;
  select?: PrimaryDB.AcademicPartnerSelect;
  orderBy?: PrimaryDB.AcademicPartnerOrderByWithRelationInput;
  cursor?: PrimaryDB.AcademicPartnerWhereUniqueInput;
  take?: number;
  skip?: number;
};
export type GetManyRecordsOutput = PrimaryDB.AcademicPartnerGetPayload<object>[];

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
    const findManyInput: PrimaryDB.AcademicPartnerFindManyArgs = {
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

    const records = await primaryDB.academicPartner.findMany(findManyInput);
    return records;
  } catch (error) {
    throw error;
  }
}

