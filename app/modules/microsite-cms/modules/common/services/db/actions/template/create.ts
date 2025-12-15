"use server";

import { TemplateModal } from "@/modules/microsite-cms/modules/common/services/db/models/template";
import connectDB from "@/modules/microsite-cms/modules/common/services/db/connection";
import { ITemplate } from "@/modules/microsite-cms/modules/common/services/db/types/interfaces";
import { writeFile } from "fs/promises";

export async function createTemplate(data: ITemplate) {
  await connectDB();

  const template = await TemplateModal.create({ ...data, status: "draft" });
  return JSON.parse(JSON.stringify(template)) as ITemplate;
}

export async function duplicateTemplate(id: string) {
  await connectDB();
  const template = await TemplateModal.findById(id);
  writeFile("template.json", JSON.stringify(template, null, 2));
  if (!template) throw new Error("Template not found");
  const duplicated = await TemplateModal.create({
    ...template,
    name: `${template.name} (Copy)`,
    status: "draft",
    globalSections: template.globalSections,
    pages: template.pages,
  });
  return JSON.parse(JSON.stringify(duplicated)) as ITemplate;
}
