"use server";
import { primaryDB } from "../../prisma/connection";
import { PrimaryDB } from "../../prisma/types";

export type UpdateRecordInput = {
  recordId: string;
  data: PrimaryDB.TopicUpdateInput;
  include?: PrimaryDB.TopicInclude;
  select?: PrimaryDB.TopicSelect;
};
export type UpdateRecordOutput = PrimaryDB.TopicGetPayload<object>;

export async function updateRecord({
  recordId,
  data,
  include,
  select,
}: UpdateRecordInput): Promise<UpdateRecordOutput> {
  try {
    const updateInput: PrimaryDB.TopicUpdateArgs = {
      where: { id: recordId },
      data,
    };

    if (include) {
      updateInput.include = include;
    }
    if (select) {
      updateInput.select = select;
    }

    const updatedData = await primaryDB.topic.update(updateInput);
    return updatedData;
  } catch (error) {
    throw error;
  }
}

