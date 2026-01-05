import mongoose, { models } from "mongoose";

const ListSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    program_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
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

export const ListModel = models.List || mongoose.model("List", ListSchema);

export default ListModel;

