import mongoose, { models } from "mongoose";

const CohortFacultySectionItemSchema = new mongoose.Schema(
  {
    position: { type: Number, required: true },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },
    parent_section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CohortFacultySection",
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

CohortFacultySectionItemSchema.index(
  { facultyId: 1, parent_section_id: 1 },
  { unique: true }
);

export const CohortFacultySectionItemModel =
  models.CohortFacultySectionItem ||
  mongoose.model("CohortFacultySectionItem", CohortFacultySectionItemSchema);

export default CohortFacultySectionItemModel;

