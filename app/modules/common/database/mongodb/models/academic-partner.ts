import mongoose, { models } from "mongoose";

const AcademicPartnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    display_name: { type: String, unique: true, sparse: true },
    description: { type: String },
    logo_url: { type: String },
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

export const AcademicPartnerModel =
  models.AcademicPartner ||
  mongoose.model("AcademicPartner", AcademicPartnerSchema);

export default AcademicPartnerModel;

