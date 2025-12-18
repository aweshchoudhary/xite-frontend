import mongoose, { models } from "mongoose";

const TopicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const TopicModel = models.Topic || mongoose.model("Topic", TopicSchema);

export default TopicModel;

