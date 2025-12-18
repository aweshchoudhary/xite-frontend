import mongoose, { models } from "mongoose";

const FacultyCodeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
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

export const FacultyCodeModel =
  models.FacultyCode || mongoose.model("FacultyCode", FacultyCodeSchema);

export default FacultyCodeModel;

