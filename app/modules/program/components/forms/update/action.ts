"use server";
import { ProgramUpdateSchema } from "../schema";
import { revalidatePath } from "next/cache";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { requireAccess } from "@/modules/common/authentication/access-control/middleware/check-access";
import { logUpdate } from "@/modules/common/lib/audit-logger";
import { getAuthUser } from "@/modules/common/authentication/firebase/action";

export async function updateProgramAction(
  data: ProgramUpdateSchema,
  programId: string,
) {
  try {
    await requireAccess("update", "Program");

    // Get initial value for audit log
    const initialProgram = await primaryDB.program.findUnique({
      where: { id: programId },
      include: { tags: true },
    });

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

    const program = await primaryDB.program.update({
      where: { id: programId },
      data: updateData,
      include: { tags: true },
    });

    if (!program) {
      throw new Error("Failed to update program");
    }

    // Log the audit entry
    try {
      const user = await getAuthUser();
      if (user) {
        await logUpdate(
          user.uid,
          user.name || user.email || "Unknown User",
          "Program",
          program.id,
          program.name,
          "postgresql",
          initialProgram,
          program,
          {
            academicPartnerId: academic_partner_id,
            enterpriseId: enterprise_id,
          },
        );
      }
    } catch (auditError) {
      console.error("Failed to create audit log:", auditError);
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
    const programs = await primaryDB.program.findMany({});
    return { data: programs };
  } catch (error) {
    throw error;
  }
}
