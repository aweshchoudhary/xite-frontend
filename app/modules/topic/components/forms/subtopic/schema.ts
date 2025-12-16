import { z } from "zod";

export const baseSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional().nullable(),
  keywords: z.array(z.string()).default([]),
  taost_id: z.string().min(1),
  topic_id: z.uuid(),
});

export const createSchema = baseSchema;

export const updateSchema = baseSchema.extend({
  id: z.uuid(),
});

export const deleteSchema = z.object({ id: z.uuid() });

export type BaseSchema = z.infer<typeof baseSchema>;
export type CreateSchema = z.infer<typeof createSchema>;
export type UpdateSchema = z.infer<typeof updateSchema>;
export type DeleteSchema = z.infer<typeof deleteSchema>;
