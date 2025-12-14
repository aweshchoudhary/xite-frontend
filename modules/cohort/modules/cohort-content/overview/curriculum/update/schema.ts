import { z } from "zod";

export const itemBaseSchema = z.object({
  title: z.string().min(1).max(255),
  overview: z.string().optional().nullable(),
  top_description: z.string().optional().nullable(),
  bottom_description: z.string().optional().nullable(),
  position: z.number(),
  objectives: z.array(
    z.object({
      description: z.string().optional().nullable(),
      position: z.number(),
    })
  ),
  sessions: z.array(
    z.object({
      title: z.string().min(1).max(255),
      position: z.number(),
      overview: z.string().optional().nullable(),
      objectives: z.array(
        z.object({
          description: z.string().optional().nullable(),
          position: z.number(),
        })
      ),
    })
  ),
});

export const baseSchema = z.object({
  title: z.string().min(1).max(255),
  items: z.array(itemBaseSchema),
  top_description: z.string().optional().nullable(),
  bottom_description: z.string().optional().nullable(),
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
