import { z } from "zod";

const listSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  items: z
    .array(
      z.object({
        id: z.string().uuid().optional(),
        title: z.string().min(1).max(255).optional(),
        description: z.string().optional().nullable(),
      })
    )
    .optional(),
});

export const baseSchema = z.object({
  title: z.string().min(1).max(255),
  top_description: z.string().optional().nullable(),
  bottom_description: z.string().optional().nullable(),
  work_experience_item: z.object({
    title: z.string().min(1).max(255).default("Work Experience"),
    description: z.string(),
    chart_image_url: z.string(),
    chart_image_file: z.instanceof(File).optional(),
  }),
  industry_item: z.object({
    title: z.string().min(1).max(255).default("Industries"),
    description: z.string().optional().nullable(),
    data_list: listSchema,
  }),
  designation_item: z.object({
    title: z.string().min(1).max(255).default("Designations"),
    description: z.string().optional().nullable(),
    data_list: listSchema,
  }),
  company_item: z.object({
    title: z.string().min(1).max(255).default("Companies"),
    top_description: z.string().optional().nullable(),
    bottom_description: z.string().optional().nullable(),
    image_url: z.string().optional().nullable(),
    image_file: z.instanceof(File).optional(),
    image_file_action: z
      .enum(["upload", "delete"])
      .optional()
      .default("upload"),
  }),
  section_width: z.enum(["center", "full"]).optional().nullable(),
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
