import { z } from "zod";

export const moduleSchema = z.object({
    title: z.string().min(1).max(255),
    overview: z.string().optional().nullable(),
    position: z.number(),
    objectives: z.array(
      z.object({
        description: z.string().optional().nullable(),
        position: z.number(),
      })
    ),
    sessions: z.array(
      z.object({
        title: z.string().min(1).max(255),
        position: z.number(),
        overview: z.string().optional().nullable(),
        topic_id: z.string().optional().nullable(),
        sub_topic_id: z.string().optional().nullable(),
        objectives: z.array(
          z.object({
            description: z.string().optional().nullable(),
            position: z.number(),
          })
        ),
      })
    ),
  });
  
export const curriculumSchema = z.object({
 items: z.array(moduleSchema).min(1),
});

export const createSchema = z.object({
 program_name: z.string().min(1).max(255),
 program_short_name: z.string().min(1).max(255),
 program_key: z.string().min(1).max(255),
 cohort_start_date: z.date(),
 cohort_end_date: z.date(),
 cohort_format: z.string(),
 cohort_duration: z.string(),
 cohort_location: z.string(),
 overview_description: z.string(),
 enterprise_id: z.uuid(),
 academic_partner_id: z.uuid(),
 tags: z.array(z.string()).optional(),
//  assigned_to: z.uuid(),
 faculties: z.array(z.object({
  facultyId: z.uuid(),
  position: z.number(),
})).min(1),
 curriculum: curriculumSchema,
});

// Types
export type CreateSchema = z.infer<typeof createSchema>;