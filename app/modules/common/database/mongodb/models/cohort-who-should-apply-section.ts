import mongoose, { models } from "mongoose";
import { SectionWidth } from "./enums";

const CohortWhoShouldApplySectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    top_description: { type: String },
    bottom_description: { type: String },
    section_width: {
      type: String,
      enum: Object.values(SectionWidth),
      default: SectionWidth.center,
    },
    is_section_visible: { type: Boolean, default: true },
    updated_by_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const CohortWhoShouldApplySectionModel =
  models.CohortWhoShouldApplySection ||
  mongoose.model(
    "CohortWhoShouldApplySection",
    CohortWhoShouldApplySectionSchema
  );

export default CohortWhoShouldApplySectionModel;

