"use server";
import {
  updateOne,
  UpdateOneInput,
  UpdateOneOutput,
} from "@/modules/program/server/update";
import { ProgramUpdateSchema } from "../schema";
import { revalidatePath } from "next/cache";
import { getCohortsByProgramId, getAll } from "@/modules/program/server/read";

export async function updateProgramAction(
  data: ProgramUpdateSchema,
  programId: string
): Promise<UpdateOneOutput> {
  try {
    const { academic_partner_id, enterprise_id, tags, ...rest } = data;

    const inputData: UpdateOneInput = {
      id: programId,
      data: {
        ...rest,
        academic_partner: {
          connect: {
            id: academic_partner_id,
          },
        },
      },
    };

    if (enterprise_id) {
      inputData.data.enterprise = {
        connect: {
          id: enterprise_id,
        },
      };
    }

    // Handle tags - connect/disconnect ProgramTag records
    if (tags !== undefined) {
      inputData.data.tags = {
        set: tags.map((tagId) => ({ id: tagId })),
      };
    }

    const program = await updateOne(inputData);

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
