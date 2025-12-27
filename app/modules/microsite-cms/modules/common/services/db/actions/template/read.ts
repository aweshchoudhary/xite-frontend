"use server";

import { TemplateModal } from "@microsite-cms/common/services/db/models/template";
import connectDB from "@microsite-cms/common/services/db/connection";
import {
  ITemplate,
  TemplateType,
} from "@microsite-cms/common/services/db/types/interfaces";

export async function getTemplates(type?: TemplateType): Promise<ITemplate[]> {
  await connectDB();
  let items;

  if (type) {
    items = await TemplateModal.find({ type });
  } else {
    items = await TemplateModal.find();
  }
  return JSON.parse(JSON.stringify(items));
}

export async function getTemplatesByCohortId(
  cohortId?: string
): Promise<ITemplate[]> {
  await connectDB();
  const templates = cohortId
    ? await TemplateModal.find({ cohortId, status: "active" })
    : [];
  const fixedTemplates = await TemplateModal.find({
    type: "fixed",
    status: "active",
  });
  return JSON.parse(JSON.stringify([...templates, ...fixedTemplates]));
}

export async function getTemplateById(id: string): Promise<ITemplate | null> {
  await connectDB();
  const template = await TemplateModal.findById(id);
  return JSON.parse(JSON.stringify(template));
}
