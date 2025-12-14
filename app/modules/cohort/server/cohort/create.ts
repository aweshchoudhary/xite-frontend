import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { CohortSectionType } from "@/modules/common/database/prisma/generated/prisma";

import { primaryDB } from "@/modules/common/database/prisma/connection";
import { getLoggedInUser } from "@/modules/user/utils";

export type CreateCohortOutputData = PrimaryDB.CohortGetPayload<object>;

export async function createCohort(data: PrimaryDB.CohortCreateInput) {
  try {
    const user = await getLoggedInUser();

    const cohort = await primaryDB.cohort.create({
      data: {
        ...data,
        owner: {
          connect: {
            id: user.dbUser?.id,
          },
        },
        updated_by: {
          connect: {
            id: user.dbUser?.id,
          },
        },
      },
    });

    const overviewSection = await primaryDB.cohortOverviewSection.create({
      data: {
        cohort: {
          connect: {
            id: cohort.id,
          },
        },
        title: "Program Overview",
        updated_by: {
          connect: {
            id: user.dbUser?.id,
          },
        },
      },
    });

    const benefitsSection = await primaryDB.cohortBenefitsSection.create({
      data: {
        cohort: {
          connect: {
            id: cohort.id,
          },
        },
        title: "Benefits",
        benefits_items: {
          create: [],
        },
        updated_by: {
          connect: {
            id: user.dbUser?.id,
          },
        },
      },
    });

    const curriculumSection =
      await primaryDB.designCohortCurriculumSection.create({
        data: {
          cohort: {
            connect: {
              id: cohort.id,
            },
          },
          title: "Curriculum",
          updated_by: {
            connect: {
              id: user.dbUser?.id,
            },
          },
        },
      });

    const facultySection = await primaryDB.cohortFacultySection.create({
      data: {
        cohort: {
          connect: {
            id: cohort.id,
          },
        },
        title: "Faculty",
        items: {
          create: [],
        },
        updated_by: {
          connect: {
            id: user.dbUser?.id,
          },
        },
      },
    });

    const industryExpertsSection =
      await primaryDB.cohortIndustryExpertsSection.create({
        data: {
          cohort: {
            connect: {
              id: cohort.id,
            },
          },
          title: "Industry Experts",
          updated_by: {
            connect: {
              id: user.dbUser?.id,
            },
          },
        },
      });

    const statisticsSection = await primaryDB.cohortStatisticsSection.create({
      data: {
        cohort: {
          connect: {
            id: cohort.id,
          },
        },
        title: "Cohort Statistics",
        updated_by: {
          connect: {
            id: user.dbUser?.id,
          },
        },
      },
    });

    const certificationSection =
      await primaryDB.cohortCertificationSection.create({
        data: {
          cohort: {
            connect: {
              id: cohort.id,
            },
          },
          title: "Certification",
          updated_by: {
            connect: {
              id: user.dbUser?.id,
            },
          },
        },
      });

    const testimonialSection = await primaryDB.cohortTestimonialSection.create({
      data: {
        cohort: {
          connect: {
            id: cohort.id,
          },
        },
        title: "Testimonials",
        updated_by: {
          connect: {
            id: user.dbUser?.id,
          },
        },
      },
    });

    const whoShouldApplySection =
      await primaryDB.cohortWhoShouldApplySection.create({
        data: {
          cohort: {
            connect: {
              id: cohort.id,
            },
          },
          title: "Who Should Apply",
          updated_by: {
            connect: {
              id: user.dbUser?.id,
            },
          },
        },
      });

    await primaryDB.cohortMediaSection.create({
      data: {
        cohort: {
          connect: {
            id: cohort.id,
          },
        },
        title: "Media",
        updated_by: {
          connect: {
            id: user.dbUser?.id,
          },
        },
      },
    });

    await primaryDB.cohortSectionMicrositeSection.create({
      data: {
        cohort: {
          connect: {
            id: cohort.id,
          },
        },
        title: "Microsite",
        updated_by: {
          connect: {
            id: user.dbUser?.id,
          },
        },
      },
    });

    const commonObject = {
      cohort_id: cohort.id,
      updated_by_id: user.dbUser?.id,
    };

    await primaryDB.cohortSectionOrder.createMany({
      data: [
        {
          ...commonObject,
          section_type: CohortSectionType.overview_section,
          section_id: overviewSection.id,
          section_position: 1,
        },
        {
          ...commonObject,
          section_type: CohortSectionType.benefits_section,
          section_id: benefitsSection.id,
          section_position: 2,
        },
        {
          ...commonObject,
          section_type: CohortSectionType.design_curriculum_section,
          section_id: curriculumSection.id,
          section_position: 3,
        },
        {
          ...commonObject,
          section_type: CohortSectionType.faculty_section,
          section_id: facultySection.id,
          section_position: 4,
        },
        {
          ...commonObject,
          section_type: CohortSectionType.industry_experts_section,
          section_id: industryExpertsSection.id,
          section_position: 5,
        },
        {
          ...commonObject,
          section_type: CohortSectionType.statistics_section,
          section_id: statisticsSection.id,
          section_position: 6,
        },
        {
          ...commonObject,
          section_type: CohortSectionType.certification_section,
          section_id: certificationSection.id,
          section_position: 7,
        },
        {
          ...commonObject,
          section_type: CohortSectionType.testimonial_section,
          section_id: testimonialSection.id,
          section_position: 8,
        },
        {
          ...commonObject,
          section_type: CohortSectionType.who_should_apply_section,
          section_id: whoShouldApplySection.id,
          section_position: 9,
        },
      ],
    });

    return cohort;
  } catch (error) {
    throw error;
  }
}
