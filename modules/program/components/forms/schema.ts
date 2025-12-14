import { z } from "zod";
import { ProgramType } from "@/modules/common/database/prisma/generated/prisma/client";

// Base schema (pure and extendable)
export const programBaseSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional().nullable(),
  type: z.nativeEnum(ProgramType).default(ProgramType.OPEN),
  academic_partner_id: z.string(),
  enterprise_id: z.string().optional().nullable(),
  short_name: z.string(),
  program_key: z.string(),
});

// Separate conditional validation logic
const validateProgramTypeFields = (
  data: Partial<z.infer<typeof programBaseSchema>>
) => {
  const issues: z.ZodIssue[] = [];

  if (data.type === ProgramType.OPEN && !data.academic_partner_id) {
    issues.push({
      path: ["academic_partner_id"],
      code: z.ZodIssueCode.custom,
      message: "Academic Partner is required for Open programs",
    });
  }

  if (data.type === ProgramType.CUSTOM && !data.enterprise_id) {
    issues.push({
      path: ["enterprise_id"],
      code: z.ZodIssueCode.custom,
      message: "Enterprise is required for Custom programs",
    });
  }

  return issues;
};

// Create schema with conditional validation
export const programCreateSchema = programBaseSchema.superRefine(
  (data, ctx) => {
    const issues = validateProgramTypeFields(data);
    issues.forEach((issue) => ctx.addIssue(issue));
  }
);

// Update schema (no conditional validation, fields are optional)
export const programUpdateBaseSchema = programBaseSchema
  .extend({
    id: z.string().uuid({ message: "Invalid Object ID" }),
  })
  .partial();

export const programUpdateSchema = programUpdateBaseSchema.superRefine(
  (data, ctx) => {
    const issues = validateProgramTypeFields(data);
    issues.forEach((issue) => ctx.addIssue(issue));
  }
);

// Delete schema
export const programDeleteSchema = z.object({
  id: z.string().uuid({ message: "Invalid Object ID" }),
});

// Types
export type ProgramBaseSchema = z.infer<typeof programBaseSchema>;
export type ProgramCreateSchema = z.infer<typeof programCreateSchema>;
export type ProgramUpdateSchema = z.infer<typeof programUpdateSchema>;
export type ProgramDeleteSchema = z.infer<typeof programDeleteSchema>;
