"use server";

import { MicrositeModel } from "@/modules/common/database/mongodb/models/microsite";
import connectDB from "@/modules/common/database/mongodb/connection";

export async function deleteMicrosite(id: string) {
  await connectDB();
  await MicrositeModel.findByIdAndDelete(id);
  return { success: true };
}
