"use server";
import { updateRecord } from "@/modules/common/database/controllers/program/update";
import { ProgramUpdateSchema } from "../schema";
import { revalidatePath } from "next/cache";
import { getCohortsByProgramId } from "@/modules/cohort/server/cohort/read";
import { PrimaryDB } from "@/modules/common/database/prisma/types";

export async function updateProgramAction(
  data: ProgramUpdateSchema,
  programId: string
) {
  try {
    const { academic_partner_id, enterprise_id, tags, ...rest } = data;

    const updateData: PrimaryDB.ProgramUpdateInput = {
      ...rest,
      academic_partner: {
        connect: {
          id: academic_partner_id,
        },
      },
    };

    if (enterprise_id) {
      updateData.enterprise = {
        connect: {
          id: enterprise_id,
        },
      };
    }

    // Handle tags - connect/disconnect ProgramTag records
    if (tags !== undefined) {
      updateData.tags = {
        set: tags.map((tagId) => ({ id: tagId })),
      };
    }

    const program = await updateRecord({
      recordId: programId,
      data: updateData,
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
    const { getManyRecords } = await import("@/modules/common/database/controllers/program/read");
    const programs = await getManyRecords({});
    return { data: programs };
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
