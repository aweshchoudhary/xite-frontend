"use server";
import { ProgramCreateSchema } from "../schema";
import { revalidatePath } from "next/cache";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { requireAccess } from "@/modules/common/authentication/access-control/middleware/check-access";
import { logCreate } from "@/modules/common/lib/audit-logger";
import { getAuthUser } from "@/modules/common/authentication/firebase/action";

export async function createProgramAction(
  data: ProgramCreateSchema,
): Promise<PrimaryDB.ProgramGetPayload<object>> {
  try {
    await requireAccess("create", "Program");

    const { academic_partner_id, enterprise_id, tags, ...rest } = data;

    const program_key = rest.short_name?.toLowerCase().replace(/\s+/g, "-");

    const createData: PrimaryDB.ProgramCreateInput = {
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
      createData.enterprise = {
        connect: { id: enterprise_id },
      };
    }

    const program = await primaryDB.program.create({
      data: createData,
    });

    if (!program) {
      throw new Error("Failed to create program");
    }

    // Log the audit entry
    try {
      const user = await getAuthUser();
      if (user) {
        await logCreate(
          user.uid,
          user.name || user.email || "Unknown User",
          "Program",
          program.id,
          program.name,
          "postgresql",
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

    return program;
  } catch (error) {
    throw error;
  }
}

export async function getProgramsAction() {
  try {
    const records = await primaryDB.program.findMany({});
    return records;
  } catch (error) {
    throw error;
  }
}
