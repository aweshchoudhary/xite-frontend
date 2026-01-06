"use server";

import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant";

/**
 * Cohort data for detail page - includes all relations needed for the detail page
 */
export type GetCohortForDetailPage = PrimaryDB.CohortGetPayload<{
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
        items: {
          include: {
            objectives: true;
          };
        };
      };
    };
  };
}>;

export type GetCohortForDetailPageOutput = {
  data?: GetCohortForDetailPage | null;
  error?: string;
};

export async function getOneForDetailPageAction(
  id: string
): Promise<GetCohortForDetailPageOutput> {
  try {
    const permission = await checkPermission("Cohort", "read");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

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
            items: {
              include: {
                objectives: true,
                sessions: {
                  include: {
                    objectives: true,
                    sub_topic: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return { data: cohort };
  } catch (error) {
    console.error(error);
    return {
      error: `Failed to get cohort`,
    };
  }
}
