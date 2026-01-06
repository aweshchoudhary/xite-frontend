"use server";
import { ProgramCreateSchema } from "../schema";
import { revalidatePath } from "next/cache";
import { getCohortsByProgramId } from "@/modules/cohort/components/forms/read/action";
import {
  createRecord,
  CreateRecordInput,
  CreateRecordOutput,
} from "@common-database/controllers/program/create";
import { getManyRecords } from "@/modules/common/database/controllers/program/read";

export async function createProgramAction(
  data: ProgramCreateSchema
): Promise<CreateRecordOutput> {
  try {
    const { academic_partner_id, enterprise_id, tags, ...rest } = data;

    const program_key = rest.short_name?.toLowerCase().replace(/\s+/g, "-");

    const createRecordInput: CreateRecordInput = {
      ...rest,
      program_key,
      academic_partner: {
        connect: { id: academic_partner_id },
      },
      tags: {
        connect: tags.map((tag) => ({ id: tag })),
      },
    };

    if (enterprise_id) {
      createRecordInput.enterprise = {
        connect: { id: enterprise_id },
      };
    }

    const program = await createRecord(createRecordInput);

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
    const records = await getManyRecords({});
    return records;
  } catch (error) {
    throw error;
  }
}

export async function getCohortsCountAction(programId: string) {
  try {
    const records = await getCohortsByProgramId({ programId });
    return records?.data?.length ?? 0;
  } catch (error) {
    throw error;
  }
}
