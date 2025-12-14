import { z } from "zod";

export const itemBaseSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional().nullable(),
  quote: z.string(),
  user_image_url: z.string().nullable().optional(),
  user_name: z.string(),
  user_designation: z.string(),
  user_company: z.string(),
  position: z.number(),
});

export const baseSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional().nullable(),
  top_description: z.string().optional().nullable(),
  bottom_description: z.string().optional().nullable(),
  items: z.array(itemBaseSchema),
  cohort_id: z.string().uuid(),
});

export const createSchema = baseSchema;

export const updateSchema = baseSchema.extend({
  items: z.array(
    itemBaseSchema.extend({
      user_image_file: z.instanceof(File).optional().nullable(),
      action: z.enum(["upload", "delete"]).optional().default("upload"),
    })
  ),
});

export const deleteSchema = z.object({ id: z.string().uuid() });

export type BaseSchema = z.infer<typeof baseSchema>;
export type CreateSchema = z.infer<typeof createSchema>;
export type UpdateSchema = z.infer<typeof updateSchema>;
export type DeleteSchema = z.infer<typeof deleteSchema>;
