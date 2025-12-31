import { z } from "zod";

export const baseSchema = z.object({
  name: z.string().min(1).max(255),
  preferred_name: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  email: z.string().email(),
  phone: z.string(),
  description: z.string().optional().nullable(),
  faculty_subject_areas: z.array(z.uuid()),
  faculty_code_id: z.uuid().optional().nullable(),
  note: z.string().optional().nullable(),
  profile_image: z.string().nullable().optional(),
  academic_partner_id: z.uuid(),
  subtopics: z.array(
    z.object({
      topic_id: z.string().nullable(),
      sub_topic_id: z.string().nullable(),
    })
  ).optional(),
});

export const createSchema = baseSchema.extend({
  profile_image_file: z.instanceof(File).optional(),
});

export const updateSchema = baseSchema.extend({
  id: z.uuid(),
  profile_image_file: z.instanceof(File).optional(),
  profile_image_file_action: z
    .enum(["upload", "delete"])
    .optional()
    .default("upload"),
});

export const deleteSchema = z.object({ id: z.uuid() });

export type BaseSchema = z.infer<typeof baseSchema>;
export type CreateSchema = z.infer<typeof createSchema>;
export type UpdateSchema = z.infer<typeof updateSchema>;
export type DeleteSchema = z.infer<typeof deleteSchema>;
