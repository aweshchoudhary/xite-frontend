"use server";

import { TemplateModal } from "@microsite-cms/common/services/db/models/template";
import connectDB from "@microsite-cms/common/services/db/connection";
import { ITemplate } from "@microsite-cms/common/services/db/types/interfaces";

export async function getTemplates(): Promise<ITemplate[]> {
  await connectDB();
  const items = await TemplateModal.find();
  return JSON.parse(JSON.stringify(items));
}

export async function getTemplatesByCohortId(
  cohortId: string
): Promise<ITemplate[]> {
  await connectDB();
  const templates = await TemplateModal.find({ cohortId });
  return JSON.parse(JSON.stringify(templates));
}

export async function getTemplateById(id: string): Promise<ITemplate | null> {
  await connectDB();
  const template = await TemplateModal.findById(id);
  return JSON.parse(JSON.stringify(template));
}
