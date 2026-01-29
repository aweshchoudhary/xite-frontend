import { primaryDB } from "@/modules/common/database/prisma/connection";
import { getMicrositeByCohortId } from "@/modules/common/database/mongodb";

export const getCohortByCohortOrProgramId = async (key: string) => {
  try {
    const cohort = await primaryDB.cohort.findFirst({
      where: {
        OR: [
          { id: key },
          { cohort_key: key },
          {
            program: {
              program_key: key,
            },
          },
          {
            program: {
              program_sf_key: key,
            },
          },
        ],
      },
      include: {
        fees: {
          include: {
            currency: true,
          },
        },
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

    let microsite = null;

    if (cohort?.cohort_key) {
      microsite = await getMicrositeByCohortId({
        cohortId: cohort?.cohort_key,
      });
    }

    return { ...cohort, microsite };
  } catch (error) {
    throw error;
  }
};
