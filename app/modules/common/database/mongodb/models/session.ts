import mongoose, { models } from "mongoose";

const SessionSchema = new mongoose.Schema(
  {
    sessionToken: { type: String, required: true, unique: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expires: { type: Date, required: true },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const SessionModel =
  models.Session || mongoose.model("Session", SessionSchema);

export default SessionModel;

