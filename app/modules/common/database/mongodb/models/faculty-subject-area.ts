import mongoose, { models } from "mongoose";

const FacultySubjectAreaSchema = new mongoose.Schema(
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

export const FacultySubjectAreaModel =
  models.FacultySubjectArea ||
  mongoose.model("FacultySubjectArea", FacultySubjectAreaSchema);

export default FacultySubjectAreaModel;

