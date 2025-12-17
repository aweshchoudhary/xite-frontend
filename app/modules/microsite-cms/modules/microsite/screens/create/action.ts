"use server";
import { getMicrositesByCohortId } from "../../../common/services/db";

export async function getMicrositesByCohortIdAction(cohortId: string) {
  console.log({ cohortId });
  const microsites = await getMicrositesByCohortId(cohortId);
  return microsites;
}
