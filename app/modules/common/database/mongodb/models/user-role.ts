import mongoose, { models } from "mongoose";

const UserRoleSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, unique: true, default: "User" },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const UserRoleModel =
  models.UserRole || mongoose.model("UserRole", UserRoleSchema);

export default UserRoleModel;

