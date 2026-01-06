"use server";

import { MODULE_NAME } from "@/modules/academic-partner/contants";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { ProgramStatus } from "@/modules/common/database/prisma/generated/prisma";

export async function getAllAction() {
  try {
    const data = await primaryDB.program.findMany({
      where: { status: ProgramStatus.ACTIVE },
    });
    return { data };
  } catch (error) {
    console.error(error);
    return {
      error: `Failed to get all ${MODULE_NAME}`,
    };
  }
}
