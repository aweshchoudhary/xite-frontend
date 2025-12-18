import mongoose, { models } from "mongoose";

const CohortStatisticsDesignationItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    data_list_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ContentListBlock",
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

export const CohortStatisticsDesignationItemModel =
  models.CohortStatisticsDesignationItem ||
  mongoose.model(
    "CohortStatisticsDesignationItem",
    CohortStatisticsDesignationItemSchema
  );

export default CohortStatisticsDesignationItemModel;

