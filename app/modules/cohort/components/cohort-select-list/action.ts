"use server";

import { getAllByStatus } from "../../server/cohort/read";

export async function getCohortListAction() {
  try {
    const cohorts = await getAllByStatus("ACTIVE");
    return cohorts;
  } catch (error) {
    throw error;
  }
}
