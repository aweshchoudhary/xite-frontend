import mongoose, { models } from "mongoose";
import { SectionWidth } from "./enums";

const CohortOverviewSectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    top_description: { type: String },
    bottom_description: { type: String },
    description: { type: String },
    is_section_visible: { type: Boolean, default: true },
    section_width: {
      type: String,
      enum: Object.values(SectionWidth),
      default: SectionWidth.center,
    },
    updated_by_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const CohortOverviewSectionModel =
  models.CohortOverviewSection ||
  mongoose.model("CohortOverviewSection", CohortOverviewSectionSchema);

export default CohortOverviewSectionModel;

