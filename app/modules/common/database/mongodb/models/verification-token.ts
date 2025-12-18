import mongoose, { models } from "mongoose";

const VerificationTokenSchema = new mongoose.Schema(
  {
    identifier: { type: String, required: true },
    token: { type: String, required: true },
    expires: { type: Date, required: true },
  },
  {
    timestamps: false,
  }
);

VerificationTokenSchema.index({ identifier: 1, token: 1 }, { unique: true });

export const VerificationTokenModel =
  models.VerificationToken ||
  mongoose.model("VerificationToken", VerificationTokenSchema);

export default VerificationTokenModel;

