"use server";
import connectDB from "@microsite-cms/common/services/db/connection";
import { TemplateModal } from "@microsite-cms/common/services/db/models/template";
import { ITemplate } from "@microsite-cms/common/services/db/types/interfaces";

export async function fetchTemplates(): Promise<ITemplate[]> {
  await connectDB();
  const templates = await TemplateModal.find();
  return JSON.parse(JSON.stringify(templates)) as ITemplate[];
}
