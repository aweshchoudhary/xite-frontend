import z from "zod";

export const updateSchema = z.object({
  program_key: z.string().min(1),
  program_sf_key: z.string().min(1),
});

export type UpdateSchema = z.infer<typeof updateSchema>;
