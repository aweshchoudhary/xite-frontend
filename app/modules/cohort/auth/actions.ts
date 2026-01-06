"use server";

import { primaryDB } from "@/modules/common/database/prisma/connection";

export const getCohortByIdAction = async (id: string) => {
  const cohort = await primaryDB.cohort.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      cohort_key: true,
      status: true,
      program_id: true,
      ownerId: true,
    },
  });
  return cohort;
};
