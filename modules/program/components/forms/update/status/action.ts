"use server";
import { createCohort } from "@/modules/cohort/server/cohort/create";
import { MODULE_NAME, MODULE_PATH } from "@/modules/program/contants";
import { updateOne } from "@/modules/program/server/update";
import { revalidatePath, unstable_expireTag as expireTag } from "next/cache";

export async function updateStatusAction(id: string) {
  try {
    const { data } = await updateOne({
      id,
      data: { status: "ACTIVE" },
    });

    // Create First Cohort
    await createCohort({
      name: data?.name + " Cohort 1",
      status: "DRAFT",
      cohort_num: 1,
      cohort_key: data?.program_key + "-cohort-1",
      program: {
        connect: {
          id,
        },
      },
    });

    if (!data) {
      throw new Error(`Data not found`);
    }

    revalidatePath(MODULE_PATH);

    // remove next cache
    expireTag("program-single", "programs-list");

    return { data };
  } catch (error) {
    console.error(error);
    return { error: `Failed to update status of ${MODULE_NAME}` };
  }
}
