import mongoose, { models } from "mongoose";

export type AuditActionType =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "APPROVE"
  | "REJECT"
  | "ARCHIVED"
  | "RESTORE"
  | "PUBLISH"
  | "UNPUBLISH";

export type DatabaseType = "postgresql" | "mongodb";

const AuditLogSchema = new mongoose.Schema(
  {
    // User information
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    userEmail: { type: String },

    // Action details
    actionType: {
      type: String,
      required: true,
      enum: [
        "CREATE",
        "UPDATE",
        "DELETE",
        "APPROVE",
        "REJECT",
        "ARCHIVED",
        "RESTORE",
        "PUBLISH",
        "UNPUBLISH",
      ],
      index: true,
    },

    // Record details
    recordId: { type: String, required: true, index: true },
    recordName: { type: String, required: true },
    recordType: { type: String, required: true, index: true }, // e.g., "Cohort", "Program", "Faculty"

    // Database information
    databaseType: {
      type: String,
      required: true,
      enum: ["postgresql", "mongodb"],
      index: true,
    },

    // Data changes
    initialValue: { type: mongoose.Schema.Types.Mixed }, // Store as JSON
    finalValue: { type: mongoose.Schema.Types.Mixed }, // Store as JSON

    // Additional metadata
    ipAddress: { type: String },
    userAgent: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed }, // For any additional context
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
);

// Create compound indexes for common queries
AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ recordType: 1, createdAt: -1 });
AuditLogSchema.index({ actionType: 1, createdAt: -1 });

export const AuditLogModel =
  models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);

export default AuditLogModel;
