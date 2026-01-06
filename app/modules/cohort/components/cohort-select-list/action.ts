"use server";

import { primaryDB } from "@/modules/common/database/prisma/connection";
import { WorkStatus } from "@/modules/common/database/prisma/generated/prisma";

export async function getCohortListAction() {
  try {
    const cohorts = await primaryDB.cohort.findMany({
      where: {
        status: WorkStatus.ACTIVE,
      },
      select: {
        id: true,
        name: true,
        cohort_key: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return cohorts;
  } catch (error) {
    throw error;
  }
}
