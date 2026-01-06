"use server";

import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { CohortSectionType } from "@/modules/common/database/prisma/generated/prisma";
import { primaryDB } from "@/modules/common/database/prisma/connection";

/**
 * Section with data for cohort content
 */
export type CohortSectionWithData = {
  id: string;
  section_type: CohortSectionType;
  section_id: string;
  section_position: number;
  data: PrimaryDB.CohortGenericSectionGetPayload<object> | null;
};

export type GetCohortSectionsOutput = {
  data?: CohortSectionWithData[];
  error?: string;
};

/**
 * Get cohort sections with their data
 */
export async function getCohortSectionsAction(
  cohortId: string
): Promise<GetCohortSectionsOutput> {
  try {
    const sectionOrders = await primaryDB.cohortSectionOrder.findMany({
      where: { cohort_id: cohortId },
      select: {
        id: true,
        section_type: true,
        section_id: true,
        section_position: true,
      },
      orderBy: { section_position: "asc" },
    });

    const sections = await Promise.all(
      sectionOrders.map(async (order) => {
        let data = null;
        if (order.section_type === "custom_section") {
          data = await primaryDB.cohortGenericSection.findUnique({
            where: { id: order.section_id },
          });
        }
        return {
          id: order.id,
          section_type: order.section_type,
          section_id: order.section_id,
          section_position: order.section_position,
          data,
        };
      })
    );

    return { data: sections };
  } catch (error) {
    console.error(error);
    return {
      error: `Failed to get cohort sections`,
    };
  }
}

/**
 * Get section order by section ID
 */
export type GetCohortSectionOrderBySectionIdOutput = {
  data: PrimaryDB.CohortSectionOrderGetPayload<object> | null;
  error?: string;
};

export async function getCohortSectionOrderBySectionIdAction(
  sectionId: string
): Promise<GetCohortSectionOrderBySectionIdOutput> {
  try {
    const sectionOrder = await primaryDB.cohortSectionOrder.findFirst({
      where: { section_id: sectionId },
    });

    return { data: sectionOrder };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: `Failed to get section order by section ID`,
    };
  }
}

/**
 * Get section order by cohort ID
 */
export type GetSectionOrderByCohortIdOutput = {
  data?: PrimaryDB.CohortSectionOrderGetPayload<object>[];
  error?: string;
};

export async function getSectionOrderByCohortIdAction(
  cohortId: string
): Promise<GetSectionOrderByCohortIdOutput> {
  try {
    const sectionOrders = await primaryDB.cohortSectionOrder.findMany({
      where: { cohort_id: cohortId },
      select: {
        id: true,
        section_type: true,
        section_id: true,
        section_position: true,
        cohort_id: true,
      },
      orderBy: { section_position: "asc" },
    });

    return { data: sectionOrders };
  } catch (error) {
    console.error(error);
    return {
      error: `Failed to get section order by cohort ID`,
    };
  }
}

