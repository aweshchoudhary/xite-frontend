import mongoose, { models } from "mongoose";

const DesignCohortCurriculumSessionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    overview: { type: String },
    position: { type: Number, default: 0 },
    parent_section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DesignCohortCurriculumSectionItem",
    },
    sub_topic_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubTopic",
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

export const DesignCohortCurriculumSessionModel =
  models.DesignCohortCurriculumSession ||
  mongoose.model(
    "DesignCohortCurriculumSession",
    DesignCohortCurriculumSessionSchema
  );

export default DesignCohortCurriculumSessionModel;

