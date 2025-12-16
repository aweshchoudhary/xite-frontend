import mongoose, { models } from "mongoose";
import { IMicrosite } from "@microsite-cms/common/services/db/types/interfaces";

const RepeaterItemSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, _id: true }
);

const BlockValueSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    type: { type: String, required: true },
    repeatable: { type: Boolean, required: true },

    value: { type: mongoose.Schema.Types.Mixed, default: null },
    items: { type: [RepeaterItemSchema], default: [] },
  },
  { _id: false }
);

const SectionBrandingSchema = new mongoose.Schema(
  {
    background: {
      color: { type: String },
      image: { type: String },
    },
    text: {
      color: { type: String },
      font: { type: String },
    },
  },
  { _id: false }
);

const SectionValueSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    branding: { type: SectionBrandingSchema, default: {} },
    blocks: { type: [BlockValueSchema], default: [] },
  },
  { _id: false }
);

const PageValueSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    meta: {
      title: { type: String, required: true },
      description: { type: String, default: "" },
      slug: { type: String, required: true },
    },

    sections: { type: [SectionValueSchema], default: [] },
  },
  { _id: false }
);

const MicrositeBrandingSchema = new mongoose.Schema(
  {
    logo: { type: String },
    favicon: { type: String },

    colors: {
      primary: { type: String },
      primary_foreground: { type: String },
      secondary: { type: String },
      secondary_foreground: { type: String },
      accent: { type: String },
      accent_foreground: { type: String },
      border: { type: String },
    },

    fonts: {
      family: { type: String },
    },
  },
  { _id: false }
);

const MicrositeSchema = new mongoose.Schema(
  {
    templateId: { type: String, required: true },
    cohortId: { type: String, required: true },

    title: { type: String },
    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "draft",
    },
    domain: { type: String },

    globalSections: { type: [SectionValueSchema], default: [] },
    pages: { type: [PageValueSchema], default: [] },
    branding: { type: MicrositeBrandingSchema, default: {} },
  },
  { timestamps: true }
);

export const MicrositeModel =
  (models.Microsite as mongoose.Model<IMicrosite>) ||
  mongoose.model<IMicrosite>("Microsite", MicrositeSchema);

export default MicrositeModel;
