"use server";

import { getCohort } from "../server/cohort/read";

export const getCohortByIdAction = async (id: string) => {
  const cohort = await getCohort({ id });
  return cohort;
};
