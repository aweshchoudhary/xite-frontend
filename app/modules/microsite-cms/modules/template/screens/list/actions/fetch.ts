import connectDB from "@/modules/microsite-cms/modules/common/services/db/connection";
import { TemplateModal } from "@/modules/microsite-cms/modules/common/services/db/models/template";
import { ITemplate } from "@/modules/microsite-cms/modules/common/services/db/types/interfaces";

export async function fetchTemplates() {
  await connectDB();
  const templates = await TemplateModal.find();
  return JSON.parse(JSON.stringify(templates)) as ITemplate[];
}
