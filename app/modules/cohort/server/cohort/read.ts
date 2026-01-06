"use server";

import { primaryDB } from "@/modules/common/database/prisma/connection";
import { WorkStatus } from "@/modules/common/database/prisma/generated/prisma";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import {
  getRecord,
  getManyRecords,
  getManyRecordsByStatus,
} from "@/modules/common/database/controllers/cohort/read";

// ============================================================================
// Types
// ============================================================================

/**
 * Full cohort with all relations - for detail pages
 */
export type GetCohort = PrimaryDB.CohortGetPayload<{
  include: {
    program: {
      include: {
        enterprise: true;
      };
    };
    fees: {
      include: {
        currency: true;
      };
    };
    owner: true;
    media_section: true;
    microsite_section: true;
    overview_section: true;
    benefits_section: {
      include: {
        benefits_items: true;
      };
    };
    curriculum_section: {
      include: {
        items: true;
      };
    };
    statistics_section: true;
    faculty_section: {
      include: {
        items: {
          include: {
            faculty: true;
          };
        };
      };
    };
    industry_experts_section: {
      include: {
        items: {
          include: {
            industry_expert: true;
          };
        };
      };
    };
    certification_section: true;
    testimonial_section: {
      include: {
        items: true;
      };
    };
    who_should_apply_section: true;
    cohort_branding: true;
    design_curriculum_section: {
      include: {
        items: true;
      };
    };
  };
}>;

/**
 * Minimal cohort data for table view
 */
export type GetCohortForTable = PrimaryDB.CohortGetPayload<{
  select: {
    id: true;
    name: true;
    status: true;
    start_date: true;
    end_date: true;
    program_id: true;
    program: {
      select: {
        id: true;
        name: true;
        enterprise_id: true;
        enterprise: {
          select: {
            id: true;
            name: true;
          };
        };
      };
    };
  };
}>;

/**
 * Minimal cohort data for list/select components
 */
export type GetCohortByProgramId = PrimaryDB.CohortGetPayload<{
  select: {
    id: true;
    name: true;
    status: true;
    cohort_key: true;
    program_id: true;
  };
}>;

/**
 * Minimal cohort data for card view
 */
export type GetCohortForCard = PrimaryDB.CohortGetPayload<{
  select: {
    id: true;
    name: true;
    status: true;
    start_date: true;
    end_date: true;
  };
}>;

/**
 * Basic cohort for auth checks
 */
export type GetCohortBasic = PrimaryDB.CohortGetPayload<{
  select: {
    id: true;
    ownerId: true;
    status: true;
  };
}>;

/**
 * Cohort section with data
 */
export type CohortSectionWithData = {
  id: string;
  section_type: string;
  section_position: number;
  section_id: string;
  data: any;
};

/**
 * Section order output
 */
export type GetCohortSectionOrderBySectionIdOutput =
  PrimaryDB.CohortSectionOrderGetPayload<object> | null;

/**
 * Section order by cohort output
 */
export type GetSectionOrderByCohortIdOutput =
  PrimaryDB.CohortSectionOrderGetPayload<object>[];

// ============================================================================
// Functions
// ============================================================================

/**
 * Get full cohort with all relations - for detail pages
 */
export async function getCohort({
  id,
}: {
  id: string;
}): Promise<GetCohort | null> {
  try {
    const cohort = await primaryDB.cohort.findUnique({
      where: { id },
      include: {
        program: {
          include: {
            enterprise: true,
          },
        },
        fees: {
          include: {
            currency: true,
          },
        },
        owner: true,
        media_section: true,
        microsite_section: true,
        overview_section: true,
        benefits_section: {
          include: {
            benefits_items: true,
          },
        },
        curriculum_section: {
          include: {
            items: true,
          },
        },
        statistics_section: true,
        faculty_section: {
          include: {
            items: {
              include: {
                faculty: true,
              },
            },
          },
        },
        industry_experts_section: {
          include: {
            items: {
              include: {
                industry_expert: true,
              },
            },
          },
        },
        certification_section: true,
        testimonial_section: {
          include: {
            items: true,
          },
        },
        who_should_apply_section: true,
        cohort_branding: true,
        design_curriculum_section: {
          include: {
            items: true,
          },
        },
      },
    });

    return cohort as GetCohort | null;
  } catch (error) {
    throw error;
  }
}

/**
 * Get cohorts for table view - minimal data only
 */
export async function getAllByStatus(
  status: WorkStatus | "ALL"
): Promise<GetCohortForTable[]> {
  try {
    const cohorts = await getManyRecordsByStatus({
      status,
      select: {
        id: true,
        name: true,
        status: true,
        start_date: true,
        end_date: true,
        program_id: true,
        program: {
          select: {
            id: true,
            name: true,
            enterprise_id: true,
            enterprise: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return cohorts as GetCohortForTable[];
  } catch (error) {
    throw error;
  }
}

/**
 * Get active cohorts for select lists - minimal data
 */
export async function getActiveCohortsForSelect(): Promise<
  GetCohortByProgramId[]
> {
  try {
    const cohorts = await getManyRecordsByStatus({
      status: "ACTIVE",
      select: {
        id: true,
        name: true,
        status: true,
        cohort_key: true,
        program_id: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return cohorts as GetCohortByProgramId[];
  } catch (error) {
    throw error;
  }
}

/**
 * Get all cohorts - minimal data for counts
 */
export async function getAll(): Promise<GetCohortForTable[]> {
  try {
    const cohorts = await getManyRecords({
      select: {
        id: true,
        name: true,
        status: true,
        start_date: true,
        end_date: true,
        program_id: true,
        program: {
          select: {
            id: true,
            name: true,
            enterprise_id: true,
            enterprise: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return cohorts as GetCohortForTable[];
  } catch (error) {
    throw error;
  }
}

/**
 * Get cohorts for card view - minimal data
 */
export async function getCohortsForCard(): Promise<GetCohortForCard[]> {
  try {
    const cohorts = await getManyRecords({
      select: {
        id: true,
        name: true,
        status: true,
        start_date: true,
        end_date: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return cohorts as GetCohortForCard[];
  } catch (error) {
    throw error;
  }
}

/**
 * Get cohorts by program ID - minimal data for select lists
 */
export async function getCohortsByProgramId({
  programId,
}: {
  programId: string;
}): Promise<{ data: GetCohortByProgramId[] }> {
  try {
    const cohorts = await getManyRecords({
      where: {
        program_id: programId,
      },
      select: {
        id: true,
        name: true,
        status: true,
        cohort_key: true,
        program_id: true,
      },
      orderBy: {
        cohort_num: "asc",
      },
    });

    return { data: cohorts as GetCohortByProgramId[] };
  } catch (error) {
    throw error;
  }
}

/**
 * Get basic cohort data - for auth checks
 */
export async function getCohortBasic({
  id,
}: {
  id: string;
}): Promise<GetCohortBasic | null> {
  try {
    const cohort = await getRecord({
      recordId: id,
      select: {
        id: true,
        ownerId: true,
        status: true,
      },
    });

    return cohort as GetCohortBasic | null;
  } catch (error) {
    throw error;
  }
}

/**
 * Get cohort sections with their data
 */
export async function getCohortSections(
  cohortId: string
): Promise<CohortSectionWithData[]> {
  try {
    const sectionOrders = await primaryDB.cohortSectionOrder.findMany({
      where: { cohort_id: cohortId },
      orderBy: { section_position: "asc" },
    });

    const sectionsWithData: CohortSectionWithData[] = [];

    for (const order of sectionOrders) {
      let sectionData: any = null;

      switch (order.section_type) {
        case "overview_section":
          sectionData = await primaryDB.cohortOverviewSection.findUnique({
            where: { id: order.section_id },
          });
          break;
        case "benefits_section":
          sectionData = await primaryDB.cohortBenefitsSection.findUnique({
            where: { id: order.section_id },
            include: { benefits_items: true },
          });
          break;
        case "design_curriculum_section":
          sectionData = await primaryDB.designCohortCurriculumSection.findUnique({
            where: { id: order.section_id },
            include: { items: true },
          });
          break;
        case "faculty_section":
          sectionData = await primaryDB.cohortFacultySection.findUnique({
            where: { id: order.section_id },
            include: {
              items: {
                include: { faculty: true },
              },
            },
          });
          break;
        case "industry_experts_section":
          sectionData =
            await primaryDB.cohortIndustryExpertsSection.findUnique({
              where: { id: order.section_id },
              include: {
                items: {
                  include: { industry_expert: true },
                },
              },
            });
          break;
        case "statistics_section":
          sectionData = await primaryDB.cohortStatisticsSection.findUnique({
            where: { id: order.section_id },
          });
          break;
        case "certification_section":
          sectionData = await primaryDB.cohortCertificationSection.findUnique({
            where: { id: order.section_id },
          });
          break;
        case "testimonial_section":
          sectionData = await primaryDB.cohortTestimonialSection.findUnique({
            where: { id: order.section_id },
            include: { items: true },
          });
          break;
        case "who_should_apply_section":
          sectionData = await primaryDB.cohortWhoShouldApplySection.findUnique({
            where: { id: order.section_id },
          });
          break;
        case "custom_section":
          sectionData = await primaryDB.cohortGenericSection.findUnique({
            where: { id: order.section_id },
          });
          break;
      }

      if (sectionData) {
        sectionsWithData.push({
          id: order.id,
          section_type: order.section_type,
          section_position: order.section_position,
          section_id: order.section_id,
          data: sectionData,
        });
      }
    }

    return sectionsWithData;
  } catch (error) {
    throw error;
  }
}

/**
 * Get section order by section ID
 */
export async function getCohortSectionOrderBySectionId(
  sectionId: string
): Promise<GetCohortSectionOrderBySectionIdOutput> {
  try {
    const sectionOrder = await primaryDB.cohortSectionOrder.findFirst({
      where: { section_id: sectionId },
    });

    return sectionOrder;
  } catch (error) {
    throw error;
  }
}

/**
 * Get section order by cohort ID
 */
export async function getSectionOrderByCohortId(
  cohortId: string
): Promise<GetSectionOrderByCohortIdOutput> {
  try {
    const sectionOrders = await primaryDB.cohortSectionOrder.findMany({
      where: { cohort_id: cohortId },
      orderBy: { section_position: "asc" },
    });

    return sectionOrders;
  } catch (error) {
    throw error;
  }
}

