"use server";

import { MicrositeModel } from "@/modules/microsite-cms/modules/common/services/db/models/microsite";
import connectDB from "@/modules/microsite-cms/modules/common/services/db/connection";

export async function deleteMicrosite(id: string) {
  await connectDB();
  await MicrositeModel.findByIdAndDelete(id);
  return { success: true };
}
