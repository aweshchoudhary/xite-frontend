import { z } from "zod";

export const MicrositeElementValue = z.record(z.string(), z.any());

export const MicrositeRepeaterItem = z.object({
  data: MicrositeElementValue,
});

export const MicrositeBlockValue = z.object({
  key: z.string(),
  type: z.enum(["single", "group"]),
  repeatable: z.boolean(),

  value: MicrositeElementValue.nullable().optional(),
  items: z.array(MicrositeRepeaterItem).nullable().optional(),
});

export const MicrositeSectionValue = z.object({
  key: z.string(),
  blocks: z.array(MicrositeBlockValue),
});

export const MicrositePageValue = z.object({
  name: z.string(),
  meta: z.object({
    title: z.string(),
    description: z.string().optional(),
    slug: z.string(),
  }),
  sections: z.array(MicrositeSectionValue),
});

export const MicrositeBrandingSchema = z.object({
  logo: z.union([z.string(), z.instanceof(File)]).optional(),
  favicon: z.union([z.string(), z.instanceof(File)]).optional(),
  colors: z
    .object({
      primary: z.string().optional(),
      primary_foreground: z.string().optional(),
      secondary: z.string().optional(),
      secondary_foreground: z.string().optional(),
      accent: z.string().optional(),
      accent_foreground: z.string().optional(),
      border: z.string().optional(),
    })
    .optional(),
  fonts: z
    .object({
      family: z.string().optional(),
    })
    .optional(),
});

export const MicrositeSchema = z.object({
  micrositeId: z.string().min(1),
  title: z.string().optional(),
  status: z.enum(["draft", "active", "archived"]),

  globalSections: z.array(MicrositeSectionValue),
  pages: z.array(MicrositePageValue),
  branding: MicrositeBrandingSchema.optional(),
});

export type MicrositeFormInput = z.infer<typeof MicrositeSchema>;
