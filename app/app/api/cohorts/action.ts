import { primaryDB } from "@/modules/common/database/prisma/connection";
import { WorkStatus } from "@/modules/common/database/prisma/generated/prisma";

export const getCohortsAction = async () => {
  try {
    const cohorts = await primaryDB.cohort.findMany({
      where: {
        status: WorkStatus.ACTIVE,
      },

      include: {
        program: {
          include: {
            academic_partner: true,
          },
        },

        media_section: true,
        overview_section: true,
        microsite_section: {
          select: {
            custom_domain: true,
          },
        },
      },
    });

    return cohorts;
  } catch (error) {
    throw error;
  }
};
