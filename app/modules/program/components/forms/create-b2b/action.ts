"use server";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { CreateSchema } from "./schema";
import { revalidatePath } from "next/cache";

export async function createProgramAction(
  data: CreateSchema
): Promise<void> {
  try {

    await primaryDB.$transaction(async (tx) => {
      const program = await tx.program.create({
        data: {
          name: data.program_name,
          short_name: data.program_short_name,
          program_key: data.program_key,
          academic_partner: {
            connect: {
              id: data.academic_partner_id,
            }
          },
          enterprise: {
            connect: {
              id: data.enterprise_id,
            }
          },
        },
      });

      const cohort = await tx.cohort.create({
        data: {
          name: data.program_name,
          program_id: program.id,
          cohort_key: data.program_key + "-cohort-1",
          start_date: data.cohort_start_date,
          end_date: data.cohort_end_date,
          format: data.cohort_format,
          duration: data.cohort_duration,
          location: data.cohort_location,
        },
      });

      const curriculumSection = await tx.cohortOverviewSection.create({
        data: {
          cohort: {
            connect: {
              id: cohort.id,
            }
          },
          title: "Overview",
          description: data.overview_description,
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
              }
            },
            objectives: {
              createMany: {
                data: item.objectives.map((objective) => ({
                  description: objective.description || "",
                  position: objective.position,
                })),
              }
            },
            sessions: {
              createMany: {
                data: item.sessions.map((session)=>({
                  title: session.title,
                  position: session.position,
                  overview: session.overview || "",
                  objectives: {
                    createMany: {
                      data: session.objectives.map((objective)=>({
                        description: objective.description || "",
                        position: objective.position,
                      })),
                    }
                  },
                  sub_topic_id: session.sub_topic_id || null,
                }))
              }
            }
          }
        })
      }

      await tx.cohortFacultySection.create({
        data: {
          title: "Faculty",
          items: {
            connect: data.faculties.map((faculty) => ({
              id: faculty,
            })),
          },
          cohort: {
            connect: {
              id: cohort.id,
            }
          },
        },
      });

    });

    revalidatePath("/programs");

    // return program;
  } catch (error) {
    throw error;
  }
}