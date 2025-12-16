"use server";

import { TemplateModal } from "@microsite-cms/common/services/db/models/template";
import connectDB from "@microsite-cms/common/services/db/connection";

export async function deleteTemplate(id: string) {
  await connectDB();
  await TemplateModal.findByIdAndDelete(id);
  return { success: true };
}
