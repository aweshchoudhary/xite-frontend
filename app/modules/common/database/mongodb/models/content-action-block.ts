import mongoose, { models } from "mongoose";
import { ContentActionBlockType } from "./enums";

const ContentActionBlockSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    text: { type: String, required: true },
    target: {
      type: String,
      enum: Object.values(ContentActionBlockType),
      default: ContentActionBlockType.primary,
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

export const ContentActionBlockModel =
  models.ContentActionBlock ||
  mongoose.model("ContentActionBlock", ContentActionBlockSchema);

export default ContentActionBlockModel;

