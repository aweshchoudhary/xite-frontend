"use server";

import { TemplateModal } from "@microsite-cms/common/services/db/models/template";
import connectDB from "@microsite-cms/common/services/db/connection";
import { ITemplate } from "@microsite-cms/common/services/db/types/interfaces";

export async function createTemplate(data: ITemplate) {
  await connectDB();

  const template = await TemplateModal.create({ ...data, status: "draft" });
  return JSON.parse(JSON.stringify(template)) as ITemplate;
}

export async function duplicateTemplate(
  id: string,
  cohortId?: string
) {
  await connectDB();
  const template = await TemplateModal.findById(id);

  if (!template) throw new Error("Template not found");

  const duplicated = await TemplateModal.create({
    ...template,
    name: `${template.name} (Copy)`,
    cohortId: cohortId ?? template.cohortId,
    status: "draft",
    globalSections: template.globalSections,
    pages: template.pages,
  });
  return JSON.parse(JSON.stringify(duplicated)) as ITemplate;
}
