"use server";

import { MicrositeModel } from "@/modules/common/database/mongodb/models/microsite";
import connectDB from "@/modules/common/database/mongodb/connection";
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

function normalizeDomain(input: string) {
  try {
    // If protocol missing, add dummy one so URL can parse it
    const url = input.startsWith("http")
      ? new URL(input)
      : new URL(`https://${input}`);

    return url.hostname.replace(/^www\./, "");
  } catch {
    // fallback (for malformed input)
    return input
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0];
  }
}

export async function getMicrositeById(id: string) {
  await connectDB();
  return JSON.parse(JSON.stringify(await MicrositeModel.findById(id).lean()));
}

export async function getMicrositeByDomain(domain: string) {
  await connectDB();

  const normalized = normalizeDomain(domain);
  console.log("normalized domain:", normalized);

  return await MicrositeModel.findOne({
    $expr: {
      $regexMatch: {
        input: {
          $replaceAll: {
            input: {
              $replaceAll: {
                input: "$domain",
                find: "https://",
                replacement: "",
              },
            },
            find: "http://",
            replacement: "",
          },
        },
        regex: normalized,
        options: "i",
      },
    },
  }).lean();
}

export async function getMicrositesByCohortId(cohortId: string) {
  await connectDB();
  return JSON.parse(
    JSON.stringify(await MicrositeModel.find({ cohortId }).lean()),
  );
}

export async function getMicrositeByCohortId({
  cohortId,
}: {
  cohortId: string;
}) {
  await connectDB();
  return JSON.parse(
    JSON.stringify(await MicrositeModel.findOne({ cohortId }).lean()),
  );
}
