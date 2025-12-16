import mongoose, { models } from "mongoose";
import { ITemplate } from "@microsite-cms/common/services/db/types/interfaces";

const ElementSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    required: { type: Boolean, default: false },
    config: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: false }
);

const BlockSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    repeatable: { type: Boolean, default: false },

    elements: [ElementSchema],

    type: { type: String, default: "group", enum: ["group", "single"] },
  },
  { _id: false }
);

const SectionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, index: true },
    title: String,
    blocks: [BlockSchema],
  },
  { _id: false }
);

const PageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    sections: [SectionSchema],
  },
  { _id: false }
);

const TemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cohortId: { type: String, required: false },
    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "draft",
    },
    type: {
      type: String,
      enum: ["fixed", "open"],
      default: "open",
    },
    globalSections: { type: [SectionSchema], default: [] },
    description: String,
    pages: [PageSchema],
  },
  {
    timestamps: true,
  }
);

export const TemplateModal =
  models.Template || mongoose.model<ITemplate>("Template", TemplateSchema);
