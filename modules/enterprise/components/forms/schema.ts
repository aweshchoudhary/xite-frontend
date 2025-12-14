import { z } from "zod";

export const baseSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional().nullable(),
  address: z.string(),
  note: z.string().optional().nullable(),
});

export const createSchema = baseSchema;

export const updateSchema = baseSchema
  .extend({ id: z.string().uuid() })
  .partial();

export const deleteSchema = z.object({ id: z.string().uuid() });

export type BaseSchema = z.infer<typeof baseSchema>;
export type CreateSchema = z.infer<typeof createSchema>;
export type UpdateSchema = z.infer<typeof updateSchema>;
export type DeleteSchema = z.infer<typeof deleteSchema>;
