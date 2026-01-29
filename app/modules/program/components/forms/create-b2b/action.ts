"use server";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { CreateSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { getUser } from "@/modules/common/authentication/firebase/action";

export async function createProgramAction(data: CreateSchema): Promise<void> {
  try {
    const currentUser = await getUser();

    await primaryDB.$transaction(async (tx) => {
      const program = await tx.program.create({
        data: {
          name: data.program_name,
          short_name: data.program_short_name,
          program_key: data.program_key,
          proposal: data.proposal || null,
          type: "CUSTOM",
          tags: {
            connect: data.tags?.map((tag) => ({
              id: tag,
            })),
          },
          status: "ACTIVE",
          academic_partner: {
            connect: {
              id: data.academic_partner_id,
            },
          },
          enterprise: {
            connect: {
              id: data.enterprise_id,
            },
          },
        },
      });

      const cohort = await tx.cohort.create({
        data: {
          name: data.program_name + " - Cohort 1",
          program_id: program.id,
          cohort_key: data.program_key + "-cohort-1",
          start_date: data.cohort_start_date,
          end_date: data.cohort_end_date,
          format: data.cohort_format,
          duration: data.cohort_duration,
          location: data.cohort_location,
          ownerId: currentUser?.dbUser.id,
        },
      });

      await tx.cohortOverviewSection.create({
        data: {
          cohort: {
            connect: {
              id: cohort.id,
            },
          },
          title: "Overview",
          description: data.overview_description,
        },
      });

      const curriculumSection = await tx.designCohortCurriculumSection.create({
        data: {
          cohort: {
            connect: {
              id: cohort.id,
            },
          },
          title: "Curriculum",
        },
      });

      for (const item of data.curriculum.items) {
        await tx.designCohortCurriculumSectionItem.create({
          data: {
            title: item.title,
            overview: item.overview || "",
            parent_section: {
              connect: {
                id: curriculumSection.id,
              },
            },
            objectives: {
              createMany: {
                data: item.objectives.map((objective) => ({
                  description: objective.description || "",
                  position: objective.position,
                })),
              },
            },
            sessions: {
              create: item.sessions.map((session) => ({
                title: session.title,
                position: session.position,
                overview: session.overview || "",
                objectives: {
                  createMany: {
                    data: session.objectives.map((objective) => ({
                      description: objective.description || "",
                      position: objective.position,
                    })),
                  },
                },
                sub_topic_id: session.sub_topic_id || null,
              })),
            },
          },
        });
      }

      await tx.cohortFacultySection.create({
        data: {
          title: "Faculty",
          items: {
            createMany: {
              data: data.faculties.map((faculty) => ({
                facultyId: faculty.facultyId,
                position: faculty.position,
              })),
            },
          },
          cohort: {
            connect: {
              id: cohort.id,
            },
          },
        },
      });

      await tx.cohortBenefitsSection.create({
        data: {
          cohort: {
            connect: {
              id: cohort.id,
            },
          },
          title: "Benefits",
        },
      });

      await tx.cohortMediaSection.create({
        data: {
          cohort: {
            connect: {
              id: cohort.id,
            },
          },
          title: "Media",
        },
      });

      await tx.cohortWhoShouldApplySection.create({
        data: {
          cohort: {
            connect: {
              id: cohort.id,
            },
          },
          title: "Who Should Apply",
        },
      });
    });

    revalidatePath("/programs");

    // return program;
  } catch (error) {
    throw error;
  }
}
