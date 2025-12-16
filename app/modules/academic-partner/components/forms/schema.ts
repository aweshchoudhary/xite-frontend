import { z } from "zod";

export const baseSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional().nullable(),
  logo_url: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  display_name: z.string().optional().nullable(),
});

export const createSchema = baseSchema.extend({
  logo_file: z.instanceof(File).optional().nullable(),
});

export const updateSchema = baseSchema.extend({
  id: z.uuid(),
  logo_file: z.instanceof(File).optional().nullable(),
  logo_file_action: z.enum(["upload", "delete"]).optional().nullable(),
});

export const deleteSchema = z.object({ id: z.uuid() });

export type BaseSchema = z.infer<typeof baseSchema>;
export type CreateSchema = z.infer<typeof createSchema>;
export type UpdateSchema = z.infer<typeof updateSchema>;
export type DeleteSchema = z.infer<typeof deleteSchema>;
