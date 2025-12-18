import mongoose, { models } from "mongoose";

const MicrositePagesSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String },
    is_active: { type: Boolean, default: true },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CohortSectionMicrositeSection",
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

export const MicrositePagesModel =
  models.MicrositePages ||
  mongoose.model("MicrositePages", MicrositePagesSchema);

export default MicrositePagesModel;

