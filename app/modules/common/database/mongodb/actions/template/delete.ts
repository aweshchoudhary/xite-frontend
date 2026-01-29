"use server";

import { TemplateModal } from "@/modules/common/database/mongodb/models/template";
import connectDB from "@/modules/common/database/mongodb/connection";

export async function deleteTemplate(id: string) {
  await connectDB();
  await TemplateModal.findByIdAndDelete(id);
  return { success: true };
}
