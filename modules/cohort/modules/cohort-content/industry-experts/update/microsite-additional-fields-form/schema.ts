import { z } from "zod";

export const baseSchema = z.object({
  top_description: z.string().optional().nullable(),
  bottom_description: z.string().optional().nullable(),
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
