import { WorkStatus } from "@/modules/common/database";
import { z } from "zod";

export const feeSchema = z.object({
  currency_code: z.string().min(1),
  amount: z.number().min(0),
});

export const baseSchema = z.object({
  name: z.string().min(1).max(255).nullable().optional(),
  start_date: z.date().nullable().optional(),
  end_date: z.date().nullable().optional(),
  format: z.string(),
  duration: z.string(),
  location: z.string(),
  status: z.nativeEnum(WorkStatus).default(WorkStatus.DRAFT),
  program_id: z.string(),
  fees: z.array(feeSchema),
  max_cohort_size: z.number().min(0).default(0),
});

export const createSchema = baseSchema;

export const updateSchema = baseSchema.extend({
  id: z.string().uuid(),
  fees: z.array(
    feeSchema.extend({
      id: z.string().optional(),
      action: z.enum(["create", "update", "delete"]).optional(),
    })
  ),
});

export const deleteSchema = z.object({ id: z.string().uuid() });

export type BaseSchema = z.infer<typeof baseSchema>;
export type CreateSchema = z.infer<typeof createSchema>;
export type UpdateSchema = z.infer<typeof updateSchema>;
export type DeleteSchema = z.infer<typeof deleteSchema>;
