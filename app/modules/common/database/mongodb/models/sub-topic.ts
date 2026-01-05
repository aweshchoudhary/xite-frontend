import mongoose, { models } from "mongoose";

const SubTopicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    keywords: { type: [String], default: [] },
    taost_id: { type: String, required: true, unique: true },
    topic_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const SubTopicModel =
  models.SubTopic || mongoose.model("SubTopic", SubTopicSchema);

export default SubTopicModel;

