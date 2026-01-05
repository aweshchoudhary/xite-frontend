"use server";
import { updateOne, UpdateOneOutput } from "@/modules/program/server/update";
import { ProgramUpdateSchema } from "../schema";
import { revalidatePath } from "next/cache";
import { getCohortsByProgramId, getAll } from "@/modules/program/server/read";

export async function updateProgramAction(
  data: ProgramUpdateSchema,
  programId: string
): Promise<UpdateOneOutput> {
  try {
    const program = await updateOne({
      id: programId,
      data,
    });

    if (!program) {
      throw new Error("Failed to update program");
    }

    revalidatePath("/programs");
    revalidatePath(`/programs/${programId}/edit`);
    revalidatePath(`/programs/${programId}`);

    return program;
  } catch (error) {
    throw error;
  }
}

export async function getProgramsAction() {
  try {
    const programs = await getAll({});
    return programs;
  } catch (error) {
    throw error;
  }
}

export async function getCohortsCountAction(programId: string) {
  try {
    const { data: cohorts } = await getCohortsByProgramId({ programId });
    return cohorts?.length ?? 0;
  } catch (error) {
    throw error;
  }
}
