"use server";
import { primaryDB } from "../../prisma/connection";
import { PrimaryDB } from "../../prisma/types";

export type UpdateRecordInput = {
  recordId: string;
  data: PrimaryDB.EnterpriseUpdateInput;
  include?: PrimaryDB.EnterpriseInclude;
  select?: PrimaryDB.EnterpriseSelect;
};
export type UpdateRecordOutput = PrimaryDB.EnterpriseGetPayload<object>;

export async function updateRecord({
  recordId,
  data,
  include,
  select,
}: UpdateRecordInput): Promise<UpdateRecordOutput> {
  try {
    const updateInput: PrimaryDB.EnterpriseUpdateArgs = {
      where: { id: recordId },
      data,
    };

    if (include) {
      updateInput.include = include;
    }
    if (select) {
      updateInput.select = select;
    }

    const updatedData = await primaryDB.enterprise.update(updateInput);
    return updatedData;
  } catch (error) {
    throw error;
  }
}

