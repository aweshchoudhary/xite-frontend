import { primaryDB } from "@/modules/common/database";

export async function deleteCohort({ cohortId }: { cohortId: string }) {
  try {
    const cohort = await primaryDB.cohort.delete({
      where: { id: cohortId },
    });

    return cohort;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
