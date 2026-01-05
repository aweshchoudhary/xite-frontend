import mongoose, { models } from "mongoose";

const CohortMediaSectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    banner_image_url: { type: String },
    banner_image_width: { type: Number },
    brochure_url: { type: String },
    university_logo_url: { type: String },
    university_logo_width: { type: Number },
    university_banner_url: { type: String },
    university_banner_width: { type: Number },
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

export const CohortMediaSectionModel =
  models.CohortMediaSection ||
  mongoose.model("CohortMediaSection", CohortMediaSectionSchema);

export default CohortMediaSectionModel;

