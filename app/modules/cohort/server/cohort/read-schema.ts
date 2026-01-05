export const GetCohortInclude = {
  overview_section: true,
  benefits_section: {
    include: {
      benefits_items: true,
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
  certification_section: true,
  media_section: true,
  generic_sections: {
    include: {
      background: true,
    },
  },
  section_order: true,
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
  cohort_branding: {
    include: {
      primary_color: true,
      secondary_color: true,
      background_color: true,
    },
  },
  microsite_section: true,
  testimonial_section: {
    include: {
      items: true,
    },
  },
  who_should_apply_section: true,
  fees: {
    include: {
      currency: true,
    },
  },
  program: true,
  design_curriculum_section: {
    include: {
      items: {
        include: {
          objectives: true,
          sessions: {
            include: {
              objectives: true,
              sub_topic: {
                include: {
                  topic: true,
                },
              },
            },
          },
        },
      },
    },
  },
  owner: true,
};
