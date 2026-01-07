import { primaryDB } from "@/modules/common/database/prisma/connection";

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
        program: {
          include: {
            academic_partner: true,
          },
        },
        media_section: true,
        benefits_section: {
          include: {
            benefits_items: true,
          },
        },
        overview_section: true,
      },
      orderBy: {
        cohort_num: "desc",
      },
    });

    return cohort;
  } catch (error) {
    throw error;
  }
};
