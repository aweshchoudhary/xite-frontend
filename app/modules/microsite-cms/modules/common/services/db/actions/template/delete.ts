"use server";

import { TemplateModal } from "@/modules/microsite-cms/modules/common/services/db/models/template";
import connectDB from "@/modules/microsite-cms/modules/common/services/db/connection";

export async function deleteTemplate(id: string) {
  await connectDB();
  await TemplateModal.findByIdAndDelete(id);
  return { success: true };
}
