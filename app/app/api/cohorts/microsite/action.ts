import { primaryDB } from "@/modules/common/database/prisma/connection";
import { getMicrositeByDomain } from "@/modules/microsite-cms/modules/common/services/db";

export const getCohortByDomain = async (domain: string) => {
  try {

    const microsite = await getMicrositeByDomain(domain);

    if(!microsite) {
      return null;
    }

    const cohort = await primaryDB.cohort.findFirst({
      where: {
        cohort_key: microsite.cohortId,
      },
      include: {
        fees: {
          include: {
            currency: true
          }
        },
        faculty_section: {
          include: {
            items: {
              include: {
                faculty: true
              }
            }
          }
        },
        industry_experts_section: {
          include: {
            items: {
              include: {
                faculty: true
              }
            }
          }
        },
        program: {
          include: {
            academic_partner: true,
          },
        },
        who_should_apply_section: true,
        media_section: true,
        benefits_section: {
          include: {
            benefits_items: true,
          },
        },
        overview_section: true,
        design_curriculum_section: {
          include: {
            items: {
              orderBy: {
                position: "asc",
              },
              include: {
                objectives: true,
                sessions: {
                  include: {
                    objectives: true,
                  },
                  orderBy: {
                    position: "asc",
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        cohort_num: "desc",
      },
    });


    return {...cohort, microsite};
  } catch (error) {
    throw error;
  }
};
