import { updateCohort } from "../../server/cohort/update";

type Input = {
  cohortId: string;
  userId: string;
};

type Output = {
  success: boolean;
  message: string;
};

export async function assignUserToCohort({ cohortId, userId }: Input) {
  try {
    await updateCohort({
      cohortId,
      data: { owner: { connect: { id: userId } } },
    });
    return { success: true, message: "User assigned to cohort" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to assign user to cohort" };
  }
}
