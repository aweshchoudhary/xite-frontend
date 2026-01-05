import mongoose, { models } from "mongoose";

const EnterpriseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    note: { type: String },
    address: { type: String },
    updated_by_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const EnterpriseModel =
  models.Enterprise || mongoose.model("Enterprise", EnterpriseSchema);

export default EnterpriseModel;

