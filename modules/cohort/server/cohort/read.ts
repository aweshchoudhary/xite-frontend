"use server";
import { PrimaryDB, primaryDB } from "@/modules/common/database";
import {
  CohortSectionType,
  WorkStatus,
} from "@/modules/common/database/prisma/generated/prisma";
import { GetCohortInclude } from "./read-schema";

export type GetCohort = PrimaryDB.CohortGetPayload<{
  include: {
    program: true;
    overview_section: true;
    benefits_section: {
      include: {
        benefits_items: true;
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
    certification_section: true;
    media_section: true;
    generic_sections: {
      include: {
        background: true;
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
            faculty_subject_areas: {
              include: {
                subject_area: true;
              };
            };
          };
        };
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
    section_order: true;
    cohort_branding: {
      include: {
        primary_color: true;
        secondary_color: true;
        background_color: true;
      };
    };
    microsite_section: true;
    testimonial_section: {
      include: {
        items: true;
      };
    };
    who_should_apply_section: true;
    fees: {
      include: { currency: true };
    };
    design_curriculum_section: {
      include: {
        items: {
          include: {
            objectives: true;
            sessions: {
              include: {
                objectives: true;
              };
            };
          };
        };
      };
    };
    owner: true;
  };
}>;

export type GetCohortForTable = PrimaryDB.CohortGetPayload<{
  include: {
    program: true;
    fees: {
      include: {
        currency: true;
      };
    };
  };
}>;

export async function getCohorts() {
  try {
    const cohorts = await primaryDB.cohort.findMany({
      include: {
        program: true,
        fees: {
          include: {
            currency: true,
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
        design_curriculum_section: {
          include: {
            items: {
              include: {
                objectives: true,
                sessions: {
                  include: {
                    objectives: true,
                  },
                },
              },
            },
          },
        },
        owner: true,
      },
    });
    if (!cohorts) {
      throw new Error("No cohorts found");
    }
    return cohorts;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllByStatus(status: WorkStatus | "ALL") {
  try {
    const cohorts = await primaryDB.cohort.findMany({
      where: {
        status: status === "ALL" ? undefined : status,
      },
      include: {
        program: true,
        fees: {
          include: {
            currency: true,
          },
        },
        owner: true,
      },
    });
    if (!cohorts) {
      throw new Error("No cohorts found");
    }
    return cohorts;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAll() {
  try {
    const cohorts = await primaryDB.cohort.findMany({
      where: {},
      include: {
        program: true,
        fees: {
          include: {
            currency: true,
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
        design_curriculum_section: {
          include: {
            items: {
              include: {
                objectives: true,
                sessions: {
                  include: {
                    objectives: true,
                  },
                },
              },
            },
          },
        },
        owner: true,
      },
    });
    if (!cohorts) {
      throw new Error("No cohorts found");
    }
    return cohorts;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getCohort({
  id,
  accessCheck = true,
}: {
  id: string;
  accessCheck?: boolean;
}): Promise<GetCohort> {
  try {
    const cohort = await primaryDB.cohort.findFirst({
      where: {
        OR: [
          {
            id,
          },
          {
            cohort_key: id,
          },
          {
            microsite_section: {
              custom_domain: id,
            },
          },
        ],
      },
      include: GetCohortInclude,
    });

    if (!cohort) {
      throw new Error("Cohort not found");
    }

    return cohort;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export type GetCohortByProgramId = PrimaryDB.CohortGetPayload<{
  include: {
    program: true;
  };
}>;

export async function getCohortsByProgramId({
  programId,
}: {
  programId: string;
}): Promise<GetCohortByProgramId[]> {
  try {
    const cohorts = await primaryDB.cohort.findMany({
      where: {
        program_id: programId,
        status: "ACTIVE",
      },
      include: {
        program: true,
      },
    });
    if (!cohorts) {
      throw new Error("No cohorts found");
    }
    return cohorts;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getCohortsByProgramIdWithoutMicrosite({
  programId,
}: {
  programId: string;
}): Promise<GetCohortByProgramId[]> {
  try {
    const cohorts = await primaryDB.cohort.findMany({
      where: {
        program_id: programId,
        status: "ACTIVE",
      },
      include: {
        program: true,
      },
    });
    if (!cohorts) {
      throw new Error("No cohorts found");
    }
    return cohorts;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export type GetLatestCohortByProgramIdInput = {
  programId: string;
};

export type GetLatestCohortByProgramIdOutput = {
  data?: GetCohort | null;
  error?: string;
};

export async function getLatestCohortByProgramId({
  programId,
}: GetLatestCohortByProgramIdInput): Promise<GetLatestCohortByProgramIdOutput> {
  try {
    const lastCohort = await primaryDB.cohort.findFirst({
      where: {
        program_id: programId,
        status: "ACTIVE",
      },
      include: GetCohortInclude,
      orderBy: {
        start_date: "desc",
      },
    });

    return { data: lastCohort };
  } catch (error) {
    throw error;
  }
}

export interface CohortSectionWithData {
  id: string;
  section_type: CohortSectionType;
  section_position: number;
  section_id: string;
  data: any; // actual section data
}

export async function getCohortSections(
  cohortId: string
): Promise<CohortSectionWithData[]> {
  // 1️⃣ Get ordered section references
  const sectionOrders = await primaryDB.cohortSectionOrder.findMany({
    where: { cohort_id: cohortId },
    orderBy: { section_position: "asc" },
  });

  // 2️⃣ Fetch actual section data
  const sectionsWithData = await Promise.all(
    sectionOrders.map(async (s) => {
      let data: any = null;

      switch (s.section_type) {
        case CohortSectionType.overview_section:
          data = await primaryDB.cohortOverviewSection.findUnique({
            where: { id: s.section_id },
          });
          break;

        case CohortSectionType.benefits_section:
          data = await primaryDB.cohortBenefitsSection.findUnique({
            where: { id: s.section_id },
          });
          break;

        case CohortSectionType.design_curriculum_section:
          data = await primaryDB.designCohortCurriculumSection.findUnique({
            where: { id: s.section_id },
          });
          break;

        case CohortSectionType.custom_section:
          data = await primaryDB.cohortGenericSection.findUnique({
            where: { id: s.section_id },
          });
          break;
        // Add other section types here if you have them
        case CohortSectionType.faculty_section:
          data = await primaryDB.cohortFacultySection.findUnique({
            where: { id: s.section_id },
          });
          break;
        case CohortSectionType.industry_experts_section:
          data = await primaryDB.cohortIndustryExpertsSection.findUnique({
            where: { id: s.section_id },
          });
          break;
        case CohortSectionType.statistics_section:
          data = await primaryDB.cohortStatisticsSection.findUnique({
            where: { id: s.section_id },
          });
          break;
        case CohortSectionType.certification_section:
          data = await primaryDB.cohortCertificationSection.findUnique({
            where: { id: s.section_id },
          });
          break;
        case CohortSectionType.testimonial_section:
          data = await primaryDB.cohortTestimonialSection.findUnique({
            where: { id: s.section_id },
          });
          break;
        case CohortSectionType.who_should_apply_section:
          data = await primaryDB.cohortWhoShouldApplySection.findUnique({
            where: { id: s.section_id },
          });
          break;

        default:
          data = null;
      }

      return {
        id: s.id,
        section_type: s.section_type,
        section_position: s.section_position,
        section_id: s.section_id,
        data,
      };
    })
  );

  return sectionsWithData;
}

export type GetCohortSectionOrderBySectionIdOutput =
  PrimaryDB.CohortSectionOrderGetPayload<object>;

export async function getCohortSectionOrderBySectionId(
  section_id: string
): Promise<GetCohortSectionOrderBySectionIdOutput> {
  const sectionOrder = await primaryDB.cohortSectionOrder.findFirst({
    where: { section_id },
  });

  if (!sectionOrder) {
    throw new Error("Section order not found");
  }

  return sectionOrder;
}

export type GetSectionOrderByCohortIdOutput =
  PrimaryDB.CohortSectionOrderGetPayload<object>;

export async function getSectionOrderByCohortId(
  cohort_id: string
): Promise<GetSectionOrderByCohortIdOutput[]> {
  const sectionOrder = await primaryDB.cohortSectionOrder.findMany({
    where: { cohort_id },
  });

  return sectionOrder;
}
