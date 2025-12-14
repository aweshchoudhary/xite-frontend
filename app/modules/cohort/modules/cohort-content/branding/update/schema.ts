import { z } from "zod";

export const colorSchema = z.object({
  text_color: z.string(),
  background_color: z.string(),
});
export type ColorSchema = z.infer<typeof colorSchema>;

export const baseSchema = z.object({
  font_name: z.string(),
  primary_color: colorSchema,
  secondary_color: colorSchema,
  background_color: colorSchema,
  default_border_radius: z.number().optional().nullable(),
  cohort_id: z.string().uuid(),
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
