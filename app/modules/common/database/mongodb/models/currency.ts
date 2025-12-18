import mongoose, { models } from "mongoose";

const CurrencySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    updated_by_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const CurrencyModel =
  models.Currency || mongoose.model("Currency", CurrencySchema);

export default CurrencyModel;

