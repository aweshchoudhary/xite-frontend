import { primaryDB } from "@/modules/common/database/prisma/connection";

export async function cohortStageChange() {
  const cohorts = await primaryDB.cohort.updateMany({
    where: {
      status: "PLANNING",
    },
    data: {
      status: "DRAFT",
    },
  });
  console.log(`Updated ${cohorts.count} cohorts to DRAFT`);
  return cohorts.count;
}
