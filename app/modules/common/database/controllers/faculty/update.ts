import { primaryDB } from "../../prisma/connection";
import { PrimaryDB } from "../../prisma/types";

export type UpdateRecordInput = {
  recordId: string;
  data: PrimaryDB.FacultyUpdateInput;
  include?: PrimaryDB.FacultyInclude;
  select?: PrimaryDB.FacultySelect;
};
export type UpdateRecordOutput = PrimaryDB.FacultyGetPayload<object>;

export async function updateRecord({
  recordId,
  data,
  include,
  select,
}: UpdateRecordInput): Promise<UpdateRecordOutput> {
  try {
    const updateInput: PrimaryDB.FacultyUpdateArgs = {
      where: { id: recordId },
      data,
    };

    if (include) {
      updateInput.include = include;
    }
    if (select) {
      updateInput.select = select;
    }

    const updatedData = await primaryDB.faculty.update(updateInput);
    return updatedData;
  } catch (error) {
    throw error;
  }
}

