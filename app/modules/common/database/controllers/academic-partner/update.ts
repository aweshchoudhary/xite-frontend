"use server";
import { primaryDB } from "../../prisma/connection";
import { PrimaryDB } from "../../prisma/types";

export type UpdateRecordInput = {
  recordId: string;
  data: PrimaryDB.AcademicPartnerUpdateInput;
  include?: PrimaryDB.AcademicPartnerInclude;
  select?: PrimaryDB.AcademicPartnerSelect;
};
export type UpdateRecordOutput = PrimaryDB.AcademicPartnerGetPayload<object>;

export async function updateRecord({
  recordId,
  data,
  include,
  select,
}: UpdateRecordInput): Promise<UpdateRecordOutput> {
  try {
    const updateInput: PrimaryDB.AcademicPartnerUpdateArgs = {
      where: { id: recordId },
      data,
    };

    if (include) {
      updateInput.include = include;
    }
    if (select) {
      updateInput.select = select;
    }

    const updatedData = await primaryDB.academicPartner.update(updateInput);
    return updatedData;
  } catch (error) {
    throw error;
  }
}

