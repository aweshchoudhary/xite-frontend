"use server";

import { MicrositeModel } from "@microsite-cms/common/services/db/models/microsite";
import connectDB from "@microsite-cms/common/services/db/connection";
import { TemplateType } from "../../types/interfaces";

export async function getMicrosites(type?: TemplateType) {
  await connectDB();
  let items;

  if (type) {
    items = await MicrositeModel.find({ type });
  } else {
    items = await MicrositeModel.find();
  }
  return JSON.parse(JSON.stringify(items));
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

export async function getMicrositeByCohortId({
  cohortId,
}: {
  cohortId: string;
}) {
  await connectDB();
  return JSON.parse(
    JSON.stringify(await MicrositeModel.findOne({ cohortId }).lean())
  );
}
