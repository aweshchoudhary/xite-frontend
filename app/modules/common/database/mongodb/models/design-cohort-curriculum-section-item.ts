import mongoose, { models } from "mongoose";

const DesignCohortCurriculumSectionItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    overview: { type: String },
    parent_section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DesignCohortCurriculumSection",
      required: true,
    },
    position: { type: Number, default: 0 },
    updated_by_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const DesignCohortCurriculumSectionItemModel =
  models.DesignCohortCurriculumSectionItem ||
  mongoose.model(
    "DesignCohortCurriculumSectionItem",
    DesignCohortCurriculumSectionItemSchema
  );

export default DesignCohortCurriculumSectionItemModel;

