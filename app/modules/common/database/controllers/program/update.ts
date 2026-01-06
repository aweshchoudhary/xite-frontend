import { primaryDB } from "../../prisma/connection";
import { PrimaryDB } from "../../prisma/types";

export type UpdateInput = {
  recordId: string;
  data: PrimaryDB.ProgramUpdateInput;
};
export type UpdateOutput = PrimaryDB.ProgramGetPayload<object>;

export async function update({
  recordId,
  data,
}: UpdateInput): Promise<UpdateOutput> {
  try {
    const updatedData = await primaryDB.program.update({
      where: { id: recordId },
      data,
    });
    return updatedData;
  } catch (error) {
    throw error;
  }
}
