import { z } from "zod";

export const ElementSchema = z.object({
  key: z.string().min(1),
  title: z.string().min(1),
  type: z.enum(["text", "textarea", "richtext", "image", "file", "video"]),
  required: z.boolean(),
  config: z.record(z.any(), z.any()).optional(),
});

export const BlockSchema = z.object({
  title: z.string().min(1),
  key: z.string().min(1),
  description: z.string().optional(),

  elements: z.array(ElementSchema).min(1, "At least one element is required"),

  repeatable: z.boolean(),
  type: z.enum(["group", "single"]),
});

export const SectionSchema = z.object({
  key: z.string().min(1),
  title: z.string().min(1),
  blocks: z.array(BlockSchema).min(1, "At least one block is required"),
});

export const GlobalSectionSchema = SectionSchema;

export const PageSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  sections: z.array(SectionSchema).min(1, "At least one section is required"),
});

export const TemplateFormSchema = z.object({
  name: z.string().min(1),
  cohortId: z.string().nullable().optional(),
  status: z.enum(["draft", "active", "archived"]).optional(),
  type: z.enum(["generic", "program-specific"]).optional(),
  description: z.string().optional(),
  pages: z.array(PageSchema).min(1, "At least one page is required"),
  globalSections: z
    .array(GlobalSectionSchema)
    .min(2, "At least two global sections are required"),
});

export type TemplateFormInput = z.infer<typeof TemplateFormSchema>;
