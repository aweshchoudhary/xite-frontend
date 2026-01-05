"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";

export const getSectionById = async (id: string) => {
  return await primaryDB.cohortSectionOrder.findFirst({
    where: { section_id: id },
  });
};

export type GetPreviousSectionByCurrentSectionIdOutput = Partial<
  PrimaryDB.CohortSectionOrderGetPayload<object> & { data: any | null }
>;

export const getPreviousSectionByCurrentSectionId = async (id: string) => {
  const currentSection = await getSectionById(id);
  if (!currentSection) {
    throw new Error("Current section not found");
  }
  const previousSection = await primaryDB.cohortSectionOrder.findFirst({
    where: {
      AND: [
        {
          section_position: { equals: currentSection.section_position - 1 },
        },
        {
          cohort_id: { equals: currentSection.cohort_id },
        },
      ],
    },
  });

  const section = await primaryDB.cohortSectionOrder.findUnique({
    where: { id: previousSection?.section_id },
  });

  return { ...previousSection, data: section };
};
