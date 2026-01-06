"use server";

import { getActiveCohortsForSelect } from "../../server/cohort/read";

export async function getCohortListAction() {
  try {
    const cohorts = await getActiveCohortsForSelect();
    return cohorts;
  } catch (error) {
    throw error;
  }
}
