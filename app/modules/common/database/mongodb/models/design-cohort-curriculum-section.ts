import mongoose, { models } from "mongoose";

const DesignCohortCurriculumSectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    overview: { type: String },
    top_description: { type: String },
    bottom_description: { type: String },
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

export const DesignCohortCurriculumSectionModel =
  models.DesignCohortCurriculumSection ||
  mongoose.model(
    "DesignCohortCurriculumSection",
    DesignCohortCurriculumSectionSchema
  );

export default DesignCohortCurriculumSectionModel;

