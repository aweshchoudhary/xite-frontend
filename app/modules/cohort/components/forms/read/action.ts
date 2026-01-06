"use server";

import { PrimaryDB } from "@/modules/common/database/prisma/types";
import {
  WorkStatus,
  CohortSectionType,
} from "@/modules/common/database/prisma/generated/prisma";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant";
import { primaryDB } from "@/modules/common/database/prisma/connection";

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
            faculty: true;
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
}> & {
  industry_experts_section?: {
    items?: Array<{
      faculty?: unknown;
    }>;
  } | null;
};

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
    updated_at: true;
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
 * Get a full cohort with all relations
 */
export async function getCohort({
  id,
  accessCheck = true,
}: {
  id: string;
  accessCheck?: boolean;
}): Promise<GetCohort | null> {
  try {
    if (accessCheck) {
      const permission = await checkPermission("Cohort", "read");

      if (!permission) {
        throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
      }
    }

    const cohort = await primaryDB.cohort.findUnique({
      where: {
        id: id,
      },
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
                faculty: true,
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
 * Get all cohorts for table view
 */
export async function getAll(): Promise<GetCohortForTable[]> {
  try {
    const permission = await checkPermission("Cohort", "read");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const cohorts = await primaryDB.cohort.findMany({
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

    return cohorts as unknown as GetCohortForTable[];
  } catch (error) {
    throw error;
  }
}

/**
 * Get cohorts by status
 */
export async function getAllByStatus(
  status: WorkStatus | "ALL"
): Promise<GetCohortForTable[]> {
  try {
    const permission = await checkPermission("Cohort", "read");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const whereClause: PrimaryDB.CohortWhereInput =
      status === "ALL" ? {} : { status };
    const cohorts = await primaryDB.cohort.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        status: true,
        start_date: true,
        end_date: true,
        program_id: true,
        updated_at: true,
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

    return cohorts as unknown as GetCohortForTable[];
  } catch (error) {
    throw error;
  }
}

/**
 * Get cohorts by program ID
 */
export async function getCohortsByProgramId({
  programId,
}: {
  programId: string;
}): Promise<{ data: GetCohortByProgramId[] }> {
  try {
    const permission = await checkPermission("Cohort", "read");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const cohorts = await primaryDB.cohort.findMany({
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
 * Get last cohort by program ID
 */
export async function getLastCohortByProgramId({
  programId,
}: {
  programId: string;
}): Promise<{
  data: PrimaryDB.CohortGetPayload<{
    include: {
      program: {
        select: {
          program_key: true;
        };
      };
    };
    select: {
      cohort_num: true;
    };
  }> | null;
}> {
  try {
    const permission = await checkPermission("Cohort", "read");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    const cohorts = await primaryDB.cohort.findMany({
      where: {
        program_id: programId,
      },
      select: {
        cohort_num: true,
        program: {
          select: {
            program_key: true,
          },
        },
      },
      orderBy: {
        cohort_num: "desc",
      },
      take: 1,
    });

    return {
      data: (cohorts[0] || null) as unknown as PrimaryDB.CohortGetPayload<{
        include: {
          program: {
            select: {
              program_key: true;
            };
          };
        };
        select: {
          cohort_num: true;
        };
      }> | null,
    };
  } catch (error) {
    throw error;
  }
}

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

    return sections;
  } catch (error) {
    throw error;
  }
}

/**
 * Output type for section order by section ID
 */
export type GetCohortSectionOrderBySectionIdOutput =
  PrimaryDB.CohortSectionOrderGetPayload<object> | null;

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
 * Output type for section order by cohort ID
 */
export type GetSectionOrderByCohortIdOutput =
  PrimaryDB.CohortSectionOrderGetPayload<object>[];

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
