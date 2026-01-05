import mongoose, { models } from "mongoose";

const ContentColorsBlockSchema = new mongoose.Schema(
  {
    background_color: { type: String },
    text_color: { type: String, required: true },
    color_type: { type: String, default: "hex" },
    updated_by_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const ContentColorsBlockModel =
  models.ContentColorsBlock ||
  mongoose.model("ContentColorsBlock", ContentColorsBlockSchema);

export default ContentColorsBlockModel;

