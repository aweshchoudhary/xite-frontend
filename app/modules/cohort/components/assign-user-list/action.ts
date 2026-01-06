import { updateRecord } from "@/modules/common/database/controllers/cohort/update";

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
    await updateRecord({
      recordId: cohortId,
      data: { owner: { connect: { id: userId } } },
    });
    return { success: true, message: "User assigned to cohort" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to assign user to cohort" };
  }
}
