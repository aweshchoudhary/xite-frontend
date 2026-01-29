"use server";

import { primaryDB } from "@/modules/common/database/prisma/connection";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { ERROR_MESSAGES } from "@/modules/common/constant";
import { getLastCohortForCreateAction } from "../create/get-last-cohort-for-create-action";
import { revalidatePath } from "next/cache";
import { getOneForDetailPageAction } from "../read/get-one-for-detail-page-action";
import { getSectionOrderByCohortIdAction } from "../read/get-sections-action";
import { logCreate } from "@/modules/common/lib/audit-logger";
import { getAuthUser } from "@/modules/common/authentication/firebase/action";

export type CloneCohortOutput = {
  data?: { id: string; cohort_key: string } | null;
  error?: string;
};

/**
 * Clone a cohort with all its relational data
 */
export async function cloneCohortAction(
  cohortId: string,
): Promise<CloneCohortOutput> {
  try {
    const permission = await checkPermission("Cohort", "write");

    if (!permission) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACTION_ERR);
    }

    // Get the source cohort with all relations
    const { data: sourceCohort } = await getOneForDetailPageAction(cohortId);

    if (!sourceCohort) {
      throw new Error("Cohort not found");
    }

    // Get section orders
    const { data: sectionOrders } =
      await getSectionOrderByCohortIdAction(cohortId);

    // Get the last cohort number for the program
    const { data: lastCohortData } = await getLastCohortForCreateAction(
      sourceCohort.program_id,
    );

    if (!lastCohortData) {
      throw new Error("Failed to get last cohort data");
    }

    const newCohortNumber = lastCohortData.cohort_num + 1;
    const newCohortKey =
      lastCohortData.program_key + "-cohort-" + newCohortNumber;

    // Format the cloned cohort name: [Program Title] Cohort [Cohort Number] (Copy)
    const clonedCohortName = `${sourceCohort.program.name} Cohort ${newCohortNumber} (Copy)`;

    // Use transaction to ensure all data is cloned atomically
    const clonedCohort = await primaryDB.$transaction(async (tx) => {
      // Clone media section

      const clonedMediaSection = sourceCohort.media_section
        ? await tx.cohortMediaSection.create({
            data: {
              title: sourceCohort.media_section.title,
              description: sourceCohort.media_section.description,
              banner_image_url: sourceCohort.media_section.banner_image_url,
              banner_image_width: sourceCohort.media_section.banner_image_width,
              brochure_url: sourceCohort.media_section.brochure_url,
              university_logo_url:
                sourceCohort.media_section.university_logo_url,
              university_logo_width:
                sourceCohort.media_section.university_logo_width,
              university_banner_url:
                sourceCohort.media_section.university_banner_url,
              university_banner_width:
                sourceCohort.media_section.university_banner_width,
              is_section_visible: sourceCohort.media_section.is_section_visible,
            },
          })
        : null;

      // Clone overview section
      const clonedOverviewSection = sourceCohort.overview_section
        ? await tx.cohortOverviewSection.create({
            data: {
              title: sourceCohort.overview_section.title,
              description: sourceCohort.overview_section.description,
              top_description: sourceCohort.overview_section.top_description,
              bottom_description:
                sourceCohort.overview_section.bottom_description,
              is_section_visible:
                sourceCohort.overview_section.is_section_visible,
              section_width: sourceCohort.overview_section.section_width,
            },
          })
        : null;

      // Clone benefits section with items
      const clonedBenefitsSection = sourceCohort.benefits_section
        ? await tx.cohortBenefitsSection.create({
            data: {
              title: sourceCohort.benefits_section.title,
              top_description: sourceCohort.benefits_section.top_description,
              bottom_description:
                sourceCohort.benefits_section.bottom_description,
              section_width: sourceCohort.benefits_section.section_width,
              is_section_visible:
                sourceCohort.benefits_section.is_section_visible,
              benefits_items: {
                create: sourceCohort.benefits_section.benefits_items.map(
                  (item) => ({
                    title: item.title,
                    description: item.description,
                    top_description: item.top_description,
                    bottom_description: item.bottom_description,
                    icon_image_url: item.icon_image_url,
                  }),
                ),
              },
            },
          })
        : null;

      // Clone curriculum section with items
      const clonedCurriculumSection = sourceCohort.curriculum_section
        ? await tx.cohortCurriculumSection.create({
            data: {
              title: sourceCohort.curriculum_section.title,
              top_description: sourceCohort.curriculum_section.top_description,
              bottom_description:
                sourceCohort.curriculum_section.bottom_description,
              section_width: sourceCohort.curriculum_section.section_width,
              is_section_visible:
                sourceCohort.curriculum_section.is_section_visible,
              items: {
                create: sourceCohort.curriculum_section.items.map((item) => ({
                  title: item.title,
                  description: item.description,
                })),
              },
            },
          })
        : null;

      // Clone statistics section with nested items
      const clonedStatisticsSection = sourceCohort.statistics_section
        ? await tx.cohortStatisticsSection.create({
            data: {
              title: sourceCohort.statistics_section.title,
              top_description: sourceCohort.statistics_section.top_description,
              bottom_description:
                sourceCohort.statistics_section.bottom_description,
              section_width: sourceCohort.statistics_section.section_width,
              is_section_visible:
                sourceCohort.statistics_section.is_section_visible,
              work_experience_item: sourceCohort.statistics_section
                .work_experience_item
                ? {
                    create: {
                      title:
                        sourceCohort.statistics_section.work_experience_item
                          .title,
                      description:
                        sourceCohort.statistics_section.work_experience_item
                          .description,
                      chart_image_url:
                        sourceCohort.statistics_section.work_experience_item
                          .chart_image_url,
                    },
                  }
                : undefined,
              industry_item: sourceCohort.statistics_section.industry_item
                ? {
                    create: {
                      title:
                        sourceCohort.statistics_section.industry_item.title,
                      description:
                        sourceCohort.statistics_section.industry_item
                          .description,
                      data_list: {
                        create: {
                          title:
                            sourceCohort.statistics_section.industry_item
                              .data_list.title,
                          description:
                            sourceCohort.statistics_section.industry_item
                              .data_list.description,
                          items: {
                            create:
                              sourceCohort.statistics_section.industry_item.data_list.items?.map(
                                (item) => ({
                                  title: item.title,
                                  description: item.description,
                                }),
                              ) || [],
                          },
                        },
                      },
                    },
                  }
                : undefined,
              designation_item: sourceCohort.statistics_section.designation_item
                ? {
                    create: {
                      title:
                        sourceCohort.statistics_section.designation_item.title,
                      description:
                        sourceCohort.statistics_section.designation_item
                          .description,
                      data_list: {
                        create: {
                          title:
                            sourceCohort.statistics_section.designation_item
                              .data_list.title,
                          description:
                            sourceCohort.statistics_section.designation_item
                              .data_list.description,
                          items: {
                            create:
                              sourceCohort.statistics_section.designation_item.data_list.items?.map(
                                (item) => ({
                                  title: item.title,
                                  description: item.description,
                                }),
                              ) || [],
                          },
                        },
                      },
                    },
                  }
                : undefined,
              company_item: sourceCohort.statistics_section.company_item
                ? {
                    create: {
                      title: sourceCohort.statistics_section.company_item.title,
                      top_description:
                        sourceCohort.statistics_section.company_item
                          .top_description,
                      bottom_description:
                        sourceCohort.statistics_section.company_item
                          .bottom_description,
                      section_width:
                        sourceCohort.statistics_section.company_item
                          .section_width,
                      image_url:
                        sourceCohort.statistics_section.company_item.image_url,
                    },
                  }
                : undefined,
            },
          })
        : null;

      // Clone faculty section with items
      const clonedFacultySection = sourceCohort.faculty_section
        ? await tx.cohortFacultySection.create({
            data: {
              title: sourceCohort.faculty_section.title,
              top_description: sourceCohort.faculty_section.top_description,
              bottom_description:
                sourceCohort.faculty_section.bottom_description,
              section_width: sourceCohort.faculty_section.section_width,
              is_section_visible:
                sourceCohort.faculty_section.is_section_visible,
              items: {
                create: sourceCohort.faculty_section.items.map((item) => ({
                  position: item.position,
                  facultyId: item.facultyId,
                })),
              },
            },
          })
        : null;

      // Clone industry experts section with items
      const clonedIndustryExpertsSection = sourceCohort.industry_experts_section
        ? await tx.cohortIndustryExpertsSection.create({
            data: {
              title: sourceCohort.industry_experts_section.title,
              top_description:
                sourceCohort.industry_experts_section.top_description,
              bottom_description:
                sourceCohort.industry_experts_section.bottom_description,
              section_width:
                sourceCohort.industry_experts_section.section_width,
              is_section_visible:
                sourceCohort.industry_experts_section.is_section_visible,
              items: {
                create:
                  sourceCohort.industry_experts_section.items?.map((item) => ({
                    position: item.position,
                    facultyId: item.facultyId,
                  })) || [],
              },
            },
          })
        : null;

      // Clone certification section
      const clonedCertificationSection = sourceCohort.certification_section
        ? await tx.cohortCertificationSection.create({
            data: {
              title: sourceCohort.certification_section.title,
              top_description:
                sourceCohort.certification_section.top_description,
              bottom_description:
                sourceCohort.certification_section.bottom_description,
              certificate_image_url:
                sourceCohort.certification_section.certificate_image_url,
              is_section_visible:
                sourceCohort.certification_section.is_section_visible,
            },
          })
        : null;

      // Clone testimonial section with items
      const clonedTestimonialSection = sourceCohort.testimonial_section
        ? await tx.cohortTestimonialSection.create({
            data: {
              title: sourceCohort.testimonial_section.title,
              description: sourceCohort.testimonial_section.description,
              top_description: sourceCohort.testimonial_section.top_description,
              bottom_description:
                sourceCohort.testimonial_section.bottom_description,
              section_width: sourceCohort.testimonial_section.section_width,
              is_section_visible:
                sourceCohort.testimonial_section.is_section_visible,
              items: {
                create: sourceCohort.testimonial_section.items.map((item) => ({
                  title: item.title,
                  quote: item.quote,
                  user_image_url: item.user_image_url,
                  user_name: item.user_name,
                  user_designation: item.user_designation,
                  user_company: item.user_company,
                  position: item.position,
                })),
              },
            },
          })
        : null;

      // Clone who should apply section
      const clonedWhoShouldApplySection = sourceCohort.who_should_apply_section
        ? await tx.cohortWhoShouldApplySection.create({
            data: {
              title: sourceCohort.who_should_apply_section.title,
              description: sourceCohort.who_should_apply_section.description,
              top_description:
                sourceCohort.who_should_apply_section.top_description,
              bottom_description:
                sourceCohort.who_should_apply_section.bottom_description,
              section_width:
                sourceCohort.who_should_apply_section.section_width,
              is_section_visible:
                sourceCohort.who_should_apply_section.is_section_visible,
            },
          })
        : null;

      // Clone cohort branding with colors
      const clonedBranding = sourceCohort.cohort_branding
        ? await tx.cohortBranding.create({
            data: {
              default_border_radius:
                sourceCohort.cohort_branding.default_border_radius,
              font_name: sourceCohort.cohort_branding.font_name,
              primary_color: sourceCohort.cohort_branding.primary_color
                ? {
                    create: {
                      background_color:
                        sourceCohort.cohort_branding.primary_color
                          .background_color,
                      text_color:
                        sourceCohort.cohort_branding.primary_color.text_color,
                      color_type:
                        sourceCohort.cohort_branding.primary_color.color_type,
                    },
                  }
                : undefined,
              secondary_color: sourceCohort.cohort_branding.secondary_color
                ? {
                    create: {
                      background_color:
                        sourceCohort.cohort_branding.secondary_color
                          .background_color,
                      text_color:
                        sourceCohort.cohort_branding.secondary_color.text_color,
                      color_type:
                        sourceCohort.cohort_branding.secondary_color.color_type,
                    },
                  }
                : undefined,
              background_color: sourceCohort.cohort_branding.background_color
                ? {
                    create: {
                      background_color:
                        sourceCohort.cohort_branding.background_color
                          .background_color,
                      text_color:
                        sourceCohort.cohort_branding.background_color
                          .text_color,
                      color_type:
                        sourceCohort.cohort_branding.background_color
                          .color_type,
                    },
                  }
                : undefined,
            },
          })
        : null;

      // Clone design curriculum section with nested items
      const clonedDesignCurriculumSection =
        sourceCohort.design_curriculum_section
          ? await tx.designCohortCurriculumSection.create({
              data: {
                title: sourceCohort.design_curriculum_section.title,
                overview: sourceCohort.design_curriculum_section.overview,
                top_description:
                  sourceCohort.design_curriculum_section.top_description,
                bottom_description:
                  sourceCohort.design_curriculum_section.bottom_description,
                is_section_visible:
                  sourceCohort.design_curriculum_section.is_section_visible,
                items: {
                  create: sourceCohort.design_curriculum_section.items.map(
                    (item) => ({
                      title: item.title,
                      overview: item.overview,
                      position: item.position,
                      objectives: {
                        create: item.objectives.map((obj) => ({
                          description: obj.description,
                          position: obj.position,
                        })),
                      },
                      sessions: {
                        create: item.sessions.map((session) => ({
                          title: session.title,
                          overview: session.overview,
                          position: session.position,
                          sub_topic_id: session.sub_topic_id,
                          objectives: {
                            create: session.objectives.map((obj) => ({
                              description: obj.description,
                              position: obj.position,
                            })),
                          },
                        })),
                      },
                    }),
                  ),
                },
              },
            })
          : null;

      // Clone generic sections
      const clonedGenericSections =
        sourceCohort.generic_sections &&
        sourceCohort.generic_sections.length > 0
          ? await Promise.all(
              sourceCohort.generic_sections.map((section) =>
                tx.cohortGenericSection.create({
                  data: {
                    title: section.title,
                    description: section.description,
                    top_description: section.top_description,
                    banner_image_url: section.banner_image_url,
                    banner_image_position: section.banner_image_position,
                    bottom_description: section.bottom_description,
                    is_section_visible: section.is_section_visible,
                    background: section.background
                      ? {
                          create: {
                            background_color:
                              section.background.background_color,
                            text_color: section.background.text_color,
                            color_type: section.background.color_type,
                          },
                        }
                      : undefined,
                  },
                }),
              ),
            )
          : [];

      // Clone microsite section (without pages as they might be complex)
      const clonedMicrositeSection = sourceCohort.microsite_section
        ? await tx.cohortSectionMicrositeSection.create({
            data: {
              title: sourceCohort.microsite_section.title,
              top_description: sourceCohort.microsite_section.top_description,
              bottom_description:
                sourceCohort.microsite_section.bottom_description,
              description: sourceCohort.microsite_section.description,
              visibility_start_date:
                sourceCohort.microsite_section.visibility_start_date,
              visibility_end_date:
                sourceCohort.microsite_section.visibility_end_date,
              cohort_enrollment_link:
                sourceCohort.microsite_section.cohort_enrollment_link,
              // Note: custom_domain is unique, so we don't clone it
            },
          })
        : null;

      // Create the new cohort with all cloned sections
      const newCohort = await tx.cohort.create({
        data: {
          name: clonedCohortName,
          description: sourceCohort.description,
          start_date: sourceCohort.start_date,
          end_date: sourceCohort.end_date,
          mkt_start_date: sourceCohort.mkt_start_date,
          mkt_end_date: sourceCohort.mkt_end_date,
          format: sourceCohort.format,
          duration: sourceCohort.duration,
          location: sourceCohort.location,
          cohort_key: newCohortKey,
          cohort_num: newCohortNumber,
          status: "DRAFT", // Always clone as DRAFT
          max_cohort_size: sourceCohort.max_cohort_size,
          checklist_file_url: sourceCohort.checklist_file_url,
          jira_id: sourceCohort.jira_id,
          program_id: sourceCohort.program_id,
          media_section_id: clonedMediaSection?.id,
          overview_section_id: clonedOverviewSection?.id,
          benefits_section_id: clonedBenefitsSection?.id,
          curriculum_section_id: clonedCurriculumSection?.id,
          statistics_section_id: clonedStatisticsSection?.id,
          faculty_section_id: clonedFacultySection?.id,
          industry_experts_section_id: clonedIndustryExpertsSection?.id,
          certification_section_id: clonedCertificationSection?.id,
          testimonial_section_id: clonedTestimonialSection?.id,
          who_should_apply_section_id: clonedWhoShouldApplySection?.id,
          cohort_branding_id: clonedBranding?.id,
          design_curriculum_section_id: clonedDesignCurriculumSection?.id,
          microsite_section_id: clonedMicrositeSection?.id,
          fees: {
            create: sourceCohort.fees.map((fee) => ({
              amount: fee.amount,
              currency: {
                connect: {
                  id: fee.currency.id,
                },
              },
            })),
          },
        },
      });

      // Link generic sections to the new cohort
      if (clonedGenericSections.length > 0) {
        await tx.cohortGenericSection.updateMany({
          where: {
            id: {
              in: clonedGenericSections.map((s) => s.id),
            },
          },
          data: {
            cohort_id: newCohort.id,
          },
        });
      }

      // Clone section orders
      if (sectionOrders && sectionOrders.length > 0) {
        // Map old section IDs to new section IDs
        const sectionIdMap: Record<string, string> = {};

        if (clonedMediaSection) {
          sectionIdMap[sourceCohort.media_section!.id] = clonedMediaSection.id;
        }
        if (clonedOverviewSection) {
          sectionIdMap[sourceCohort.overview_section!.id] =
            clonedOverviewSection.id;
        }
        if (clonedBenefitsSection) {
          sectionIdMap[sourceCohort.benefits_section!.id] =
            clonedBenefitsSection.id;
        }
        if (clonedCurriculumSection) {
          sectionIdMap[sourceCohort.curriculum_section!.id] =
            clonedCurriculumSection.id;
        }
        if (clonedStatisticsSection) {
          sectionIdMap[sourceCohort.statistics_section!.id] =
            clonedStatisticsSection.id;
        }
        if (clonedFacultySection) {
          sectionIdMap[sourceCohort.faculty_section!.id] =
            clonedFacultySection.id;
        }
        if (clonedIndustryExpertsSection) {
          sectionIdMap[sourceCohort.industry_experts_section!.id] =
            clonedIndustryExpertsSection.id;
        }
        if (clonedCertificationSection) {
          sectionIdMap[sourceCohort.certification_section!.id] =
            clonedCertificationSection.id;
        }
        if (clonedTestimonialSection) {
          sectionIdMap[sourceCohort.testimonial_section!.id] =
            clonedTestimonialSection.id;
        }
        if (clonedWhoShouldApplySection) {
          sectionIdMap[sourceCohort.who_should_apply_section!.id] =
            clonedWhoShouldApplySection.id;
        }
        if (clonedDesignCurriculumSection) {
          sectionIdMap[sourceCohort.design_curriculum_section!.id] =
            clonedDesignCurriculumSection.id;
        }

        // Map generic sections
        sourceCohort.generic_sections?.forEach((oldSection, index) => {
          if (clonedGenericSections[index]) {
            sectionIdMap[oldSection.id] = clonedGenericSections[index].id;
          }
        });

        // Create section orders with new section IDs
        await tx.cohortSectionOrder.createMany({
          data: sectionOrders.map((order) => ({
            section_type: order.section_type,
            section_position: order.section_position,
            section_id: sectionIdMap[order.section_id] || order.section_id,
            cohort_id: newCohort.id,
          })),
        });
      }

      return newCohort;
    });

    try {
      const user = await getAuthUser();
      if (user) {
        await logCreate(
          user.uid,
          user.name || user.email || "Unknown User",
          "Cohort",
          clonedCohort.id,
          clonedCohortName,
          "postgresql",
          clonedCohort,
          { action: "clone", sourceCohortId: cohortId },
        );
      }
    } catch (auditError) {
      console.error("Failed to create audit log:", auditError);
    }

    revalidatePath("/cohorts");

    return {
      data: {
        id: clonedCohort.id,
        cohort_key: clonedCohort.cohort_key,
      },
    };
  } catch (error) {
    console.error("Error cloning cohort:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to clone cohort",
    };
  }
}
