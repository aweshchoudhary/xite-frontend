import mongoose, { models } from "mongoose";

const CohortBrandingSchema = new mongoose.Schema(
  {
    primary_color_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ContentColorsBlock",
      unique: true,
      sparse: true,
    },
    secondary_color_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ContentColorsBlock",
      unique: true,
      sparse: true,
    },
    background_color_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ContentColorsBlock",
      unique: true,
      sparse: true,
    },
    default_border_radius: { type: Number, required: true },
    font_name: { type: String },
    updated_by_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const CohortBrandingModel =
  models.CohortBranding ||
  mongoose.model("CohortBranding", CohortBrandingSchema);

export default CohortBrandingModel;

