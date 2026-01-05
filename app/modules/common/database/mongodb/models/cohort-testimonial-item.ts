import mongoose, { models } from "mongoose";

const CohortTestimonialItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    quote: { type: String, required: true },
    user_image_url: { type: String },
    user_name: { type: String, required: true },
    user_designation: { type: String, required: true },
    user_company: { type: String, required: true },
    parent_section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CohortTestimonialSection",
      required: true,
    },
    position: { type: Number, required: true },
    updated_by_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const CohortTestimonialItemModel =
  models.CohortTestimonialItem ||
  mongoose.model("CohortTestimonialItem", CohortTestimonialItemSchema);

export default CohortTestimonialItemModel;

