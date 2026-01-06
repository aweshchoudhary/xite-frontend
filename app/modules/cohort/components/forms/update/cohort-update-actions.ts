"use server";

import { primaryDB } from "@/modules/common/database/prisma/connection";
import { CohortSectionType } from "@/modules/common/database/prisma/generated/prisma";
import { revalidatePath } from "next/cache";

/**
 * Update cohort faculty list by creating/deleting faculty section items
 */
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
    // Get the cohort's faculty section
    const cohort = await primaryDB.cohort.findUnique({
      where: { id: cohortId },
      include: { faculty_section: { include: { items: true } } },
    });

    if (!cohort?.faculty_section) {
      throw new Error("Cohort faculty section not found");
    }

    const sectionId = cohort.faculty_section.id;
    const existingItems = cohort.faculty_section.items;

    // Get max position for new items
    const maxPosition = existingItems.length > 0
      ? Math.max(...existingItems.map((item) => item.position))
      : 0;

    // Delete items to remove
    if (facultyToRemove.length > 0) {
      await primaryDB.cohortFacultySectionItem.deleteMany({
        where: {
          parent_section_id: sectionId,
          facultyId: { in: facultyToRemove },
        },
      });
    }

    // Create new items
    if (facultyToAdd.length > 0) {
      await primaryDB.cohortFacultySectionItem.createMany({
        data: facultyToAdd.map((facultyId, index) => ({
          facultyId,
          parent_section_id: sectionId,
          position: maxPosition + index + 1,
        })),
        skipDuplicates: true,
      });
    }

    revalidatePath(`/cohorts/${cohortId}`);
    return { success: true };
  } catch (error) {
    throw error;
  }
}

/**
 * Update cohort industry experts list by creating/deleting industry expert section items
 */
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
    // Get the cohort's industry experts section
    const cohort = await primaryDB.cohort.findUnique({
      where: { id: cohortId },
      include: { industry_experts_section: { include: { items: true } } },
    });

    if (!cohort?.industry_experts_section) {
      throw new Error("Cohort industry experts section not found");
    }

    const sectionId = cohort.industry_experts_section.id;
    const existingItems = cohort.industry_experts_section.items;

    // Get max position for new items
    const maxPosition = existingItems.length > 0
      ? Math.max(...existingItems.map((item) => item.position))
      : 0;

    // Delete items to remove
    if (dataToRemove.length > 0) {
      await primaryDB.cohortIndustryExpertsSectionItem.deleteMany({
        where: {
          parent_section_id: sectionId,
          facultyId: { in: dataToRemove },
        },
      });
    }

    // Create new items
    if (dataToAdd.length > 0) {
      await primaryDB.cohortIndustryExpertsSectionItem.createMany({
        data: dataToAdd.map((facultyId, index) => ({
          facultyId,
          parent_section_id: sectionId,
          position: maxPosition + index + 1,
        })),
        skipDuplicates: true,
      });
    }

    revalidatePath(`/cohorts/${cohortId}`);
    return { success: true };
  } catch (error) {
    throw error;
  }
}

/**
 * Upsert section position in CohortSectionOrder
 */
export async function upsertSectionPosition({
  cohort_id,
  section_type,
  section_id,
  position,
}: {
  cohort_id: string;
  section_type: CohortSectionType;
  section_id: string;
  position: number;
}) {
  try {
    await primaryDB.cohortSectionOrder.upsert({
      where: {
        cohort_id_section_type_section_id: {
          cohort_id,
          section_type,
          section_id,
        },
      },
      create: {
        cohort_id,
        section_id,
        section_type,
        section_position: position,
      },
      update: {
        section_position: position,
      },
    });
  } catch (error) {
    throw error;
  }
}

