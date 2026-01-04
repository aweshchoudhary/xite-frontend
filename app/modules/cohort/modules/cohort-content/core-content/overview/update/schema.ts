import { z } from "zod";

export const baseSchema = z.object({
  title: z.string().min(1).max(255),
  top_description: z.string().optional().nullable(),
  bottom_description: z.string().optional().nullable(),
  description: z.string(),
  section_width: z.enum(["center", "full"]).optional().nullable(),
  cohort_id: z.uuid(),
});

export const updateSchema = baseSchema.extend({
  id: z.uuid().optional(),
});

export const createSchema = baseSchema;

export const deleteSchema = z.object({ id: z.uuid() });

export type BaseSchema = z.infer<typeof baseSchema>;
export type CreateSchema = z.infer<typeof createSchema>;
export type UpdateSchema = z.infer<typeof updateSchema>;
export type DeleteSchema = z.infer<typeof deleteSchema>;
