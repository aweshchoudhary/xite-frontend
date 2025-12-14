import { z } from "zod";

export const colorSchema = z.object({
  text_color: z.string(),
  background_color: z.string(),
});

export const customSectionSchema = z.object({
  title: z.string().min(1).max(255),
  top_description: z.string().optional().nullable(),
  bottom_description: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  banner_image_url: z.string().optional().nullable(),
  background: colorSchema.optional().nullable(),
  after_section_id: z.string().uuid(),
  banner_image_position: z
    .enum(["left", "right", "center", "top", "bottom"])
    .default("left"),
});

export const baseSchema = z.object({
  sections: z.array(customSectionSchema),
  cohort_id: z.string().uuid(),
});

export const updateSchema = z.object({
  cohort_id: z.string().uuid(),
  sections: z.array(
    customSectionSchema.extend({
      id: z.string().uuid().optional(),
      banner_image_file: z.instanceof(File).optional().nullable(),
      banner_image_action: z.enum(["upload", "delete"]).default("upload"),
    })
  ),
});

export const createSchema = baseSchema;

export const deleteSchema = z.object({ id: z.string().uuid() });

export type BaseSchema = z.infer<typeof baseSchema>;
export type CreateSchema = z.infer<typeof createSchema>;
export type UpdateSchema = z.infer<typeof updateSchema>;
export type DeleteSchema = z.infer<typeof deleteSchema>;
