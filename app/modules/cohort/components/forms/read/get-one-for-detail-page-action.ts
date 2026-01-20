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
    statistics_section: {
      include: {
        work_experience_item: true;
        industry_item: {
          include: {
            data_list: {
              include: {
                items: true;
              };
            };
          };
        };
        designation_item: {
          include: {
            data_list: {
              include: {
                items: true;
              };
            };
          };
        };
        company_item: true;
      };
    };
    faculty_section: {
      include: {
        items: {
          include: {
            faculty: {
              include: {
                academic_partner: true;
                faculty_subject_areas: {
                  include: {
                    subject_area: true;
                  };
                };
              };
            };
          };
        };
      };
    };
    industry_experts_section: {
      include: {
        items: {
          include: {
            faculty: {
              include: {
                academic_partner: true;
                faculty_subject_areas: {
                  include: {
                    subject_area: true;
                  };
                };
              };
            };
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
    cohort_branding: {
      include: {
        primary_color: true;
        secondary_color: true;
        background_color: true;
      };
    };
    design_curriculum_section: {
      include: {
        items: {
          include: {
            objectives: true;
            sessions: {
              include: {
                objectives: true;
                sub_topic: true;
              };
            };
          };
        };
      };
    };
    generic_sections: {
      include: {
        background: true;
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

    const cohort = await primaryDB.cohort.findFirst({
      where: { 
        OR: [
          { id: id },
          {cohort_key: id},
        ]
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
        statistics_section: {
          include: {
            work_experience_item: true,
            industry_item: {
              include: {
                data_list: {
                  include: {
                    items: true,
                  },
                },
              },
            },
            designation_item: {
              include: {
                data_list: {
                  include: {
                    items: true,
                  },
                },
              },
            },
            company_item: true,
          },
        },
        faculty_section: {
          include: {
            items: {
              include: {
                faculty: {
                  include: {
                    academic_partner: true,
                    faculty_subject_areas: {
                      include: {
                        subject_area: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        industry_experts_section: {
          include: {
            items: {
              include: {
                faculty: {
                  include: {
                    academic_partner: true,
                    faculty_subject_areas: {
                      include: {
                        subject_area: true,
                      },
                    },
                  },
                },
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
        cohort_branding: {
          include: {
            primary_color: true,
            secondary_color: true,
            background_color: true,
          },
        },
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
        generic_sections: {
          include: {
            background: true,
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
