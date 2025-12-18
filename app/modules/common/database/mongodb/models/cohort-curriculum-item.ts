import mongoose, { models } from "mongoose";

const CohortCurriculumItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    parent_section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CohortCurriculumSection",
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

export const CohortCurriculumItemModel =
  models.CohortCurriculumItem ||
  mongoose.model("CohortCurriculumItem", CohortCurriculumItemSchema);

export default CohortCurriculumItemModel;

