import mongoose, { models } from "mongoose";
import { FacultyType } from "./enums";

const FacultySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    preferred_name: { type: String },
    title: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    description: { type: String },
    note: { type: String },
    profile_image: { type: String },
    academic_partner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicPartner",
    },
    faculty_type: {
      type: String,
      enum: Object.values(FacultyType),
      default: FacultyType.PROFESSOR_TIER_1,
    },
    faculty_code_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FacultyCode",
    },
    facultySubjectAreaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FacultySubjectArea",
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

export const FacultyModel =
  models.Faculty || mongoose.model("Faculty", FacultySchema);

export default FacultyModel;

