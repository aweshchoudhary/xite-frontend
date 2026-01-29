import { z } from "zod";

export const baseSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .optional()
    .nullable(),
  roles: z.array(z.string()).min(1, "At least one role is required"),
  isActive: z.boolean().default(true),
});

export const createSchema = baseSchema;

export const updateSchema = baseSchema.extend({
  id: z.string(),
});

export const deleteSchema = z.object({
  id: z.string(),
});

export const toggleActiveSchema = z.object({
  id: z.string(),
  isActive: z.boolean(),
});

export type BaseSchema = z.infer<typeof baseSchema>;
export type CreateSchema = z.infer<typeof createSchema>;
export type UpdateSchema = z.infer<typeof updateSchema>;
export type DeleteSchema = z.infer<typeof deleteSchema>;
export type ToggleActiveSchema = z.infer<typeof toggleActiveSchema>;
