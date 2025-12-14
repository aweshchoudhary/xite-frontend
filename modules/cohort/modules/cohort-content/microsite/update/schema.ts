import { CohortSectionType } from "@/modules/common/database/prisma";
import { z } from "zod";

export const baseSchema = z.object({
  visibility_start_date: z.date().optional().nullable(),
  visibility_end_date: z.date().optional().nullable(),
  custom_domain: z.string().optional().nullable(),
  cohort_id: z.string().uuid(),
  sections: z.array(
    z.object({
      id: z.string().uuid(),
      section_position: z.number(),
      section_type: z.nativeEnum(CohortSectionType),
      section_id: z.string().uuid(),
      section_title: z.string(),
      data: z.any(),
    })
  ),
});

export const updateSchema = baseSchema.extend({
  id: z.string().uuid().optional(),
});

export const createSchema = baseSchema;

export const deleteSchema = z.object({ id: z.string().uuid() });

export type BaseSchema = z.infer<typeof baseSchema>;
export type CreateSchema = z.infer<typeof createSchema>;
export type UpdateSchema = z.infer<typeof updateSchema>;
export type DeleteSchema = z.infer<typeof deleteSchema>;
