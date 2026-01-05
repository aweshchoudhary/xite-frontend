import mongoose, { models } from "mongoose";
import { SectionWidth } from "./enums";

const CohortTestimonialSectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    top_description: { type: String },
    bottom_description: { type: String },
    is_section_visible: { type: Boolean, default: true },
    section_width: {
      type: String,
      enum: Object.values(SectionWidth),
      default: SectionWidth.center,
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

export const CohortTestimonialSectionModel =
  models.CohortTestimonialSection ||
  mongoose.model("CohortTestimonialSection", CohortTestimonialSectionSchema);

export default CohortTestimonialSectionModel;

