"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { CohortSectionType } from "@/modules/common/database/prisma/generated/prisma";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { revalidatePath } from "next/cache";
import { GetCohortInclude } from "./read-schema";
import { getLoggedInUser, checkUserOwnsCohort } from "@/modules/user/utils";

export type UpdateProgramOutputData = PrimaryDB.ProgramGetPayload<object>;
export type UpdateCohortInputData = PrimaryDB.CohortUpdateInput;

export type UpdateCohortResponse = PrimaryDB.CohortGetPayload<{
  include: typeof GetCohortInclude;
}>;

export async function updateCohort({
  cohortId,
  data,
}: {
  cohortId: string;
  data: PrimaryDB.CohortUpdateInput;
}): Promise<UpdateCohortResponse> {
  try {
    const isUserHasCohortAccess = await checkUserOwnsCohort(cohortId);

    if (!isUserHasCohortAccess) {
      throw new Error("You are not authorized to update this cohort");
    }

    const user = await getLoggedInUser();

    const cohort = await primaryDB.cohort.update({
      where: { id: cohortId },
      data: {
        ...data,
        updated_by: {
          connect: {
            id: user.id,
          },
        },
      },
      include: GetCohortInclude,
    });

    // Trigger KB process if cohort is active
    if (cohort.status === "ACTIVE") {
      fetch(`${process.env.NEXTAUTH_URL}/api/knowledge-base`, {
        method: "POST",
        body: JSON.stringify({ cohortId }),
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.XITE_API_KEY!,
        },
      }).catch((err) => console.error("Failed to trigger KB process:", err));
    }

    return cohort;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateCohortFacultyList({
  cohortId,
  facultyToAdd,
  facultyToRemove,
}: {
  cohortId: string;
  facultyToAdd: string[];
  facultyToRemove: string[];
}) {
  try {
    const isUserHasCohortAccess = await checkUserOwnsCohort(cohortId);

    if (!isUserHasCohortAccess) {
      throw new Error("You are not authorized to update this cohort");
    }

    const user = await getLoggedInUser();
    const updatedData = await primaryDB.cohort.update({
      where: { id: cohortId },
      data: {
        faculty_section: {
          update: {
            items: {
              connect: facultyToAdd.map((id) => ({ id })),
              disconnect: facultyToRemove.map((id) => ({ id })),
            },
          },
        },
        updated_by: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    revalidatePath("/cohorts");

    return updatedData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateCohortIndustryExpertsList({
  cohortId,
  dataToAdd,
  dataToRemove,
}: {
  cohortId: string;
  dataToAdd: string[];
  dataToRemove: string[];
}) {
  try {
    const isUserHasCohortAccess = await checkUserOwnsCohort(cohortId);

    if (!isUserHasCohortAccess) {
      throw new Error("You are not authorized to update this cohort");
    }

    const user = await getLoggedInUser();
    const updatedData = await primaryDB.cohort.update({
      where: { id: cohortId },
      data: {
        industry_experts_section: {
          update: {
            items: {
              connect: dataToAdd.map((id) => ({ id })),
              disconnect: dataToRemove.map((id) => ({ id })),
            },
          },
        },
        updated_by: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    revalidatePath("/cohorts");

    return updatedData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

interface UpsertSectionPositionInput {
  cohort_id: string;
  section_type: CohortSectionType;
  section_id: string;
  position: number;
}

/**
 * Upsert section position in CohortSectionOrder
 * Automatically normalizes all section positions for the cohort
 */
export async function upsertSectionPosition({
  cohort_id,
  section_type,
  section_id,
  position: newPosition,
}: UpsertSectionPositionInput) {
  const user = await getLoggedInUser();

  // Get all existing sections ordered by position
  const existingSections = await primaryDB.cohortSectionOrder.findMany({
    where: { cohort_id },
    orderBy: { section_position: "asc" },
  });

  // Find if the section already exists
  let sectionExists = existingSections.find(
    (s) => s.section_type === section_type && s.section_id === section_id
  );

  const oldPosition = sectionExists?.section_position ?? null;

  // CASE 1: Section already exists (reordering)
  if (sectionExists) {
    // If position changed, we need to shift other sections accordingly
    if (oldPosition !== newPosition) {
      if (oldPosition && oldPosition < newPosition) {
        // Moving DOWN — shift sections up
        await primaryDB.cohortSectionOrder.updateMany({
          where: {
            cohort_id,
            section_position: {
              gt: oldPosition ?? 0,
              lte: newPosition,
            },
          },
          data: { section_position: { decrement: 1 } },
        });
      } else {
        // Moving UP — shift sections down
        await primaryDB.cohortSectionOrder.updateMany({
          where: {
            cohort_id,
            section_position: {
              gte: newPosition,
              lt: oldPosition ?? 0,
            },
          },
          data: { section_position: { increment: 1 } },
        });
      }

      // Update current section to new position
      await primaryDB.cohortSectionOrder.update({
        where: { id: sectionExists.id },
        data: {
          section_position: newPosition,
          updated_by_id: user.id,
        },
      });
    }
  } else {
    // CASE 2: New section being added — shift all sections after it down
    await primaryDB.cohortSectionOrder.updateMany({
      where: {
        cohort_id,
        section_position: { gte: newPosition },
      },
      data: { section_position: { increment: 1 } },
    });

    // Create the new section
    sectionExists = await primaryDB.cohortSectionOrder.create({
      data: {
        cohort_id,
        section_type,
        section_id,
        section_position: newPosition,
        updated_by_id: user.id,
      },
    });
  }

  return sectionExists;
}
