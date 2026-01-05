import mongoose, { models } from "mongoose";

const CohortSectionMicrositeSectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    top_description: { type: String },
    bottom_description: { type: String },
    description: { type: String },
    visibility_start_date: { type: Date },
    visibility_end_date: { type: Date },
    custom_domain: { type: String, unique: true, sparse: true },
    cohort_enrollment_link: { type: String },
    updated_by_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const CohortSectionMicrositeSectionModel =
  models.CohortSectionMicrositeSection ||
  mongoose.model(
    "CohortSectionMicrositeSection",
    CohortSectionMicrositeSectionSchema
  );

export default CohortSectionMicrositeSectionModel;

