"use server";

import { getCohortBasic } from "../server/cohort/read";

export const getCohortByIdAction = async (id: string) => {
  const cohort = await getCohortBasic({ id });
  return cohort;
};
