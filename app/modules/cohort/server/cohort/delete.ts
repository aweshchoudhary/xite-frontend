import { deleteRecord } from "@/modules/common/database/controllers/cohort/delete";

export async function deleteCohort({ cohortId }: { cohortId: string }) {
  try {
    const cohort = await deleteRecord({ recordId: cohortId });
    return cohort;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
