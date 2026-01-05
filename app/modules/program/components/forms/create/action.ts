"use server";
import {
  createOne,
  CreateOneInput,
  CreateOneOutput,
} from "@/modules/program/server/create";
import { ProgramCreateSchema } from "../schema";
import { revalidatePath } from "next/cache";
import { getCohortsByProgramId, getAll } from "@/modules/program/server/read";

export async function createProgramAction(
  data: ProgramCreateSchema
): Promise<CreateOneOutput> {
  try {
    const { academic_partner_id, enterprise_id, ...rest } = data;

    const program_key = rest.short_name?.toLowerCase().replace(/\s+/g, "-");

    const createProgramData: CreateOneInput = {
      data: {
        ...rest,
        short_name: rest.short_name,
        program_key: program_key,
        academic_partner: {
          connect: { id: academic_partner_id },
        },
      },
    };

    if (enterprise_id) {
      createProgramData.data.enterprise = {
        connect: { id: enterprise_id },
      };
    }

    const program = await createOne({
      data: createProgramData.data,
    });

    if (!program) {
      throw new Error("Failed to create program");
    }

    revalidatePath("/programs");

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
