import mongoose, { models } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, sparse: true },
    username: { type: String, unique: true, sparse: true },
    emailVerified: { type: Date },
    image: { type: String },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const UserModel = models.User || mongoose.model("User", UserSchema);

export default UserModel;

