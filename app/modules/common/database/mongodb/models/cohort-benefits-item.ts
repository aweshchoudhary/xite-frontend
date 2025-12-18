import mongoose, { models } from "mongoose";

const CohortBenefitsItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    top_description: { type: String },
    bottom_description: { type: String },
    icon_image_url: { type: String },
    parent_section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CohortBenefitsSection",
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

export const CohortBenefitsItemModel =
  models.CohortBenefitsItem ||
  mongoose.model("CohortBenefitsItem", CohortBenefitsItemSchema);

export default CohortBenefitsItemModel;

