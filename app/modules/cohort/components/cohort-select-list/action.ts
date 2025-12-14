"use server";

import { getCohortsByProgramId } from "../../server/cohort/read";

export async function getCohortListAction({
  programId,
}: {
  programId: string;
}) {
  try {
    const cohorts = await getCohortsByProgramId({ programId });
    return cohorts;
  } catch (error) {
    throw error;
  }
}
