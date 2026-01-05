import mongoose, { models } from "mongoose";

const CohortStatisticsWorkExperienceItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    chart_image_url: { type: String },
    updated_by_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const CohortStatisticsWorkExperienceItemModel =
  models.CohortStatisticsWorkExperienceItem ||
  mongoose.model(
    "CohortStatisticsWorkExperienceItem",
    CohortStatisticsWorkExperienceItemSchema
  );

export default CohortStatisticsWorkExperienceItemModel;

