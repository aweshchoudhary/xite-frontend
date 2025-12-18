import mongoose, { models } from "mongoose";
import { ProgramStatus, ProgramType } from "./enums";

const ProgramSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    program_key: { type: String, required: true, unique: true },
    short_name: { type: String, default: "Program" },
    status: {
      type: String,
      enum: Object.values(ProgramStatus),
      default: ProgramStatus.DRAFT,
    },
    type: {
      type: String,
      enum: Object.values(ProgramType),
      default: ProgramType.OPEN,
    },
    enterprise_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enterprise",
    },
    academic_partner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicPartner",
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

ProgramSchema.index({ program_key: 1, _id: 1 }, { unique: true });

export const ProgramModel =
  models.Program || mongoose.model("Program", ProgramSchema);

export default ProgramModel;

