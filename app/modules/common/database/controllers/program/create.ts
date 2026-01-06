import { primaryDB } from "../../prisma/connection";
import { PrimaryDB } from "../../prisma/types";

export type CreateInput = PrimaryDB.ProgramCreateInput;
export type CreateOutput = PrimaryDB.ProgramGetPayload<object>;

export async function create(data: CreateInput): Promise<CreateOutput> {
  try {
    const createdData = await primaryDB.program.create({ data });
    return createdData;
  } catch (error) {
    throw error;
  }
}
