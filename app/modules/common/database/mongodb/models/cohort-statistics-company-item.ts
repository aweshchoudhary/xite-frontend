import mongoose, { models } from "mongoose";
import { SectionWidth } from "./enums";

const CohortStatisticsCompanyItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    top_description: { type: String },
    bottom_description: { type: String },
    section_width: {
      type: String,
      enum: Object.values(SectionWidth),
      default: SectionWidth.center,
    },
    image_url: { type: String },
    updated_by_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const CohortStatisticsCompanyItemModel =
  models.CohortStatisticsCompanyItem ||
  mongoose.model(
    "CohortStatisticsCompanyItem",
    CohortStatisticsCompanyItemSchema
  );

export default CohortStatisticsCompanyItemModel;

