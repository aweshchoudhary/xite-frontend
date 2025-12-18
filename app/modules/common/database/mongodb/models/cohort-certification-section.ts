import mongoose, { models } from "mongoose";

const CohortCertificationSectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    top_description: { type: String },
    bottom_description: { type: String },
    certificate_image_url: { type: String },
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

export const CohortCertificationSectionModel =
  models.CohortCertificationSection ||
  mongoose.model("CohortCertificationSection", CohortCertificationSectionSchema);

export default CohortCertificationSectionModel;

