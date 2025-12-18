import mongoose, { models } from "mongoose";

const CohortIndustryExpertsSectionItemSchema = new mongoose.Schema(
  {
    position: { type: Number, required: true },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },
    parent_section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CohortIndustryExpertsSection",
      required: true,
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

export const CohortIndustryExpertsSectionItemModel =
  models.CohortIndustryExpertsSectionItem ||
  mongoose.model(
    "CohortIndustryExpertsSectionItem",
    CohortIndustryExpertsSectionItemSchema
  );

export default CohortIndustryExpertsSectionItemModel;

