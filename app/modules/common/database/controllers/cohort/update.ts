"use server";
import { primaryDB } from "../../prisma/connection";
import { PrimaryDB } from "../../prisma/types";

export type UpdateRecordInput = {
  recordId: string;
  data: PrimaryDB.CohortUpdateInput;
  include?: PrimaryDB.CohortInclude;
  select?: PrimaryDB.CohortSelect;
};
export type UpdateRecordOutput = PrimaryDB.CohortGetPayload<object>;

export async function updateRecord({
  recordId,
  data,
  include,
  select,
}: UpdateRecordInput): Promise<UpdateRecordOutput> {
  try {
    const updateInput: PrimaryDB.CohortUpdateArgs = {
      where: { id: recordId },
      data,
    };

    if (include) {
      updateInput.include = include;
    }
    if (select) {
      updateInput.select = select;
    }

    const updatedData = await primaryDB.cohort.update(updateInput);
    return updatedData;
  } catch (error) {
    throw error;
  }
}

