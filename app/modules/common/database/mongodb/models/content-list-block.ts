import mongoose, { models } from "mongoose";

const ContentListBlockSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    updated_by_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const ContentListBlockModel =
  models.ContentListBlock ||
  mongoose.model("ContentListBlock", ContentListBlockSchema);

export default ContentListBlockModel;

