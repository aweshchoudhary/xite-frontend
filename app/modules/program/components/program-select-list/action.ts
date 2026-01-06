"use server";

import { MODULE_NAME } from "@/modules/academic-partner/contants";
import { getManyRecordsByStatus } from "@/modules/common/database/controllers/program/read";
import { ProgramStatus } from "@/modules/common/database/prisma/generated/prisma";

export async function getAllAction() {
  try {
    const data = await getManyRecordsByStatus({ status: ProgramStatus.ACTIVE });
    return { data };
  } catch (error) {
    console.error(error);
    return {
      error: `Failed to get all ${MODULE_NAME}`,
    };
  }
}
