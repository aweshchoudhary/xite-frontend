import mongoose, { models } from "mongoose";

const CohortFeeSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    currency_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Currency",
      required: true,
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

export const CohortFeeModel =
  models.CohortFee || mongoose.model("CohortFee", CohortFeeSchema);

export default CohortFeeModel;

