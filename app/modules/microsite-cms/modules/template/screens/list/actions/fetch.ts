"use server";
import connectDB from "@/modules/common/database/mongodb/connection";
import { TemplateModal } from "@/modules/common/database/mongodb/models/template";
import { ITemplate } from "@/modules/common/database/mongodb/types/interfaces";

export async function fetchTemplates(): Promise<ITemplate[]> {
  await connectDB();
  const templates = await TemplateModal.find();
  return JSON.parse(JSON.stringify(templates)) as ITemplate[];
}
