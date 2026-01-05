import mongoose, { models } from "mongoose";

const AuthenticatorSchema = new mongoose.Schema(
  {
    credentialID: { type: String, required: true, unique: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    providerAccountId: { type: String, required: true },
    credentialPublicKey: { type: String, required: true },
    counter: { type: Number, required: true },
    credentialDeviceType: { type: String, required: true },
    credentialBackedUp: { type: Boolean, required: true },
    transports: { type: String },
  },
  {
    timestamps: false,
  }
);

AuthenticatorSchema.index({ userId: 1, credentialID: 1 }, { unique: true });

export const AuthenticatorModel =
  models.Authenticator || mongoose.model("Authenticator", AuthenticatorSchema);

export default AuthenticatorModel;
