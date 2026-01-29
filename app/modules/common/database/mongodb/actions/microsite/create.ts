"use server";

import MicrositeModel from "@/modules/common/database/mongodb/models/microsite";
import { TemplateModal } from "@/modules/common/database/mongodb/models/template";
import {
  IMicrosite,
  ITemplateBlock,
  ITemplatePage,
  ITemplateSection,
  TemplateType,
} from "@/modules/common/database/mongodb/types/interfaces";
import connectDB from "@/modules/common/database/mongodb/connection";
import slugify from "slugify";

export async function createMicrosite(data: {
  templateId: string;
  cohortId: string;
  title?: string;
  type: TemplateType;
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
    type: data.type,
    domain: `test-${slugify(data.title ?? "", {
      lower: true,
    })}.xedinstitute.org`,

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

  return JSON.parse(JSON.stringify(created)) as IMicrosite;
}
