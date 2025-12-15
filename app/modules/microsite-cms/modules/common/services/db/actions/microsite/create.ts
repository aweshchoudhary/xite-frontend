"use server";

import MicrositeModel from "@/modules/microsite-cms/modules/common/services/db/models/microsite";
import { TemplateModal } from "@/modules/microsite-cms/modules/common/services/db/models/template";
import {
  IMicrosite,
  ITemplateBlock,
  ITemplatePage,
  ITemplateSection,
} from "@/modules/microsite-cms/modules/common/services/db/types/interfaces";
import connectDB from "@/modules/microsite-cms/modules/common/services/db/connection";
import slugify from "slugify";
import { writeFile } from "fs/promises";

export async function createMicrosite(data: {
  templateId: string;
  cohortId: string;
  title?: string;
}): Promise<IMicrosite> {
  await connectDB();

  const template = await TemplateModal.findById(data.templateId);

  if (!template) throw new Error("Template not found");

  // Convert template → empty microsite structure
  const cloneSections = (sections: ITemplateSection[]) =>
    sections.map((sec) => ({
      key: sec.key,
      blocks: sec.blocks.map((blk: ITemplateBlock) => ({
        key: blk.key,
        type: blk.type,
        repeatable: blk.repeatable,
        singleValue: blk.type === "single" ? "" : undefined,
        value: blk.type === "group" && !blk.repeatable ? {} : undefined,
        items: blk.repeatable ? [] : undefined,
      })),
    }));

  const micrositeData: IMicrosite = {
    templateId: data.templateId,
    cohortId: data.cohortId,
    title: data.title ?? "",
    status: "draft",

    globalSections: cloneSections(template.globalSections ?? []),

    pages: (template.pages ?? []).map((p: ITemplatePage) => ({
      name: p.title,
      meta: {
        title: p.title,
        description: p.title,
        slug: p.slug || slugify(p.title, { lower: true }),
      },
      sections: cloneSections(p.sections),
    })),
  };

  const created = await MicrositeModel.create(micrositeData);

  await writeFile("microsite.json", JSON.stringify(created, null, 2));

  return JSON.parse(JSON.stringify(created)) as IMicrosite;
}
