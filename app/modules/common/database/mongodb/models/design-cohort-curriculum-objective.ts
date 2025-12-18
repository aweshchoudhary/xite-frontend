import mongoose, { models } from "mongoose";

const DesignCohortCurriculumObjectiveSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    parent_section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DesignCohortCurriculumSectionItem",
    },
    position: { type: Number, default: 0 },
    designCohortCurriculumSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DesignCohortCurriculumSession",
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

export const DesignCohortCurriculumObjectiveModel =
  models.DesignCohortCurriculumObjective ||
  mongoose.model(
    "DesignCohortCurriculumObjective",
    DesignCohortCurriculumObjectiveSchema
  );

export default DesignCohortCurriculumObjectiveModel;

