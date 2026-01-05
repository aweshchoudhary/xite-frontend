import mongoose, { models } from "mongoose";
import { SectionWidth } from "./enums";

const CohortStatisticsSectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    top_description: { type: String },
    bottom_description: { type: String },
    work_experience_item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CohortStatisticsWorkExperienceItem",
      unique: true,
      sparse: true,
    },
    industry_item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CohortStatisticsIndustryItem",
      unique: true,
      sparse: true,
    },
    designation_item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CohortStatisticsDesignationItem",
      unique: true,
      sparse: true,
    },
    company_item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CohortStatisticsCompanyItem",
      unique: true,
      sparse: true,
    },
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

export const CohortStatisticsSectionModel =
  models.CohortStatisticsSection ||
  mongoose.model("CohortStatisticsSection", CohortStatisticsSectionSchema);

export default CohortStatisticsSectionModel;

