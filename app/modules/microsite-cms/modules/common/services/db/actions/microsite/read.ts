"use server";

import { MicrositeModel } from "@/modules/microsite-cms/modules/common/services/db/models/microsite";
import connectDB from "@/modules/microsite-cms/modules/common/services/db/connection";

export async function getMicrosites() {
  await connectDB();
  return JSON.parse(JSON.stringify(await MicrositeModel.find().lean()));
}

export async function getMicrositeById(id: string) {
  await connectDB();
  return JSON.parse(JSON.stringify(await MicrositeModel.findById(id).lean()));
}

export async function getMicrositeByCohort(cohortId: string) {
  await connectDB();
  return JSON.parse(
    JSON.stringify(await MicrositeModel.findOne({ cohortId }).lean())
  );
}
