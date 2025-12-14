import { z } from "zod";

export const baseSchema = z.object({
  title: z.string().min(1).max(255),
  top_description: z.string().optional().nullable(),
  bottom_description: z.string().optional().nullable(),
  certificate_image_url: z.string().optional().nullable(),
  section_width: z.enum(["center", "full"]).optional().nullable(),
  cohort_id: z.string().uuid(),
});

export const updateSchema = baseSchema.extend({
  id: z.string().uuid().optional(),
  certificate_image_file: z.instanceof(File).optional(),
  certificate_image_file_action: z
    .enum(["upload", "delete"])
    .optional()
    .default("upload"),
});

export const createSchema = baseSchema;

export const deleteSchema = z.object({ id: z.string().uuid() });

export type BaseSchema = z.infer<typeof baseSchema>;
export type CreateSchema = z.infer<typeof createSchema>;
export type UpdateSchema = z.infer<typeof updateSchema>;
export type DeleteSchema = z.infer<typeof deleteSchema>;
