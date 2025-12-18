import mongoose, { models } from "mongoose";
import { BannerImagePosition } from "./enums";

const CohortGenericSectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    top_description: { type: String },
    banner_image_url: { type: String },
    banner_image_position: {
      type: String,
      enum: Object.values(BannerImagePosition),
      default: BannerImagePosition.left,
    },
    bottom_description: { type: String },
    is_section_visible: { type: Boolean, default: true },
    background_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ContentColorsBlock",
    },
    cohort_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cohort",
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

export const CohortGenericSectionModel =
  models.CohortGenericSection ||
  mongoose.model("CohortGenericSection", CohortGenericSectionSchema);

export default CohortGenericSectionModel;

