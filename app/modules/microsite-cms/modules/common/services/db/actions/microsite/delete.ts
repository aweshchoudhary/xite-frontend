"use server";

import { MicrositeModel } from "@microsite-cms/common/services/db/models/microsite";
import connectDB from "@microsite-cms/common/services/db/connection";

export async function deleteMicrosite(id: string) {
  await connectDB();
  await MicrositeModel.findByIdAndDelete(id);
  return { success: true };
}
