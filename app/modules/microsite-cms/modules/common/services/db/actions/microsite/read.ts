"use server";

import { MicrositeModel } from "@microsite-cms/common/services/db/models/microsite";
import connectDB from "@microsite-cms/common/services/db/connection";

export async function getMicrosites() {
  await connectDB();
  return JSON.parse(JSON.stringify(await MicrositeModel.find().lean()));
}

export async function getMicrositeById(id: string) {
  await connectDB();
  return JSON.parse(JSON.stringify(await MicrositeModel.findById(id).lean()));
}

export async function getMicrositesByCohortId(cohortId: string) {
  await connectDB();
  return JSON.parse(
    JSON.stringify(await MicrositeModel.find({ cohortId }).lean())
  );
}
