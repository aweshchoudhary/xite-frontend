import mongoose, { models } from "mongoose";

const FacultySubSubjectAreaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    subject_area_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FacultySubjectArea",
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

export const FacultySubSubjectAreaModel =
  models.FacultySubSubjectArea ||
  mongoose.model("FacultySubSubjectArea", FacultySubSubjectAreaSchema);

export default FacultySubSubjectAreaModel;

