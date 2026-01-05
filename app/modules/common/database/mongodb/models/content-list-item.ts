import mongoose, { models } from "mongoose";

const ContentListItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    contentListBlockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ContentListBlock",
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

export const ContentListItemModel =
  models.ContentListItem ||
  mongoose.model("ContentListItem", ContentListItemSchema);

export default ContentListItemModel;

