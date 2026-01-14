import { PaymentMethod } from "@/modules/common/database/prisma/generated/prisma";
import z from "zod";

export const updateSchema = z.object({
  program_key: z.string().min(1),
  program_sf_key: z.string().optional(),
  payment_method: z.enum(PaymentMethod).optional(),
});

export type UpdateSchema = z.infer<typeof updateSchema>;
