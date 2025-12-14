import { z } from "zod";

export const baseSchema = z.object({
  university_logo_url: z.string().optional().nullable(),
  university_logo_width: z.number().optional().nullable(),
  cohort_id: z.string().uuid(),
});

export const updateSchema = baseSchema.extend({
  id: z.string().uuid().optional(),
  university_logo_file: z.instanceof(File).optional().nullable(),
  university_logo_file_action: z
    .enum(["upload", "delete"])
    .optional()
    .nullable()
    .default("upload"),
});

export const createSchema = baseSchema.extend({
  university_logo_file: z.instanceof(File).optional().nullable(),
  university_logo_file_action: z
    .enum(["upload", "delete"])
    .optional()
    .nullable()
    .default("upload"),
});

export const deleteSchema = z.object({ id: z.string().uuid() });

export type BaseSchema = z.infer<typeof baseSchema>;
export type CreateSchema = z.infer<typeof createSchema>;
export type UpdateSchema = z.infer<typeof updateSchema>;
export type DeleteSchema = z.infer<typeof deleteSchema>;
