import mongoose, { models } from "mongoose";
import { CohortSectionType } from "./enums";

const CohortSectionOrderSchema = new mongoose.Schema(
  {
    section_type: {
      type: String,
      enum: Object.values(CohortSectionType),
      required: true,
    },
    section_position: { type: Number, required: true },
    section_id: { type: String, required: true },
    cohort_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cohort",
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

CohortSectionOrderSchema.index(
  { cohort_id: 1, section_type: 1, section_id: 1 },
  { unique: true }
);

export const CohortSectionOrderModel =
  models.CohortSectionOrder ||
  mongoose.model("CohortSectionOrder", CohortSectionOrderSchema);

export default CohortSectionOrderModel;

