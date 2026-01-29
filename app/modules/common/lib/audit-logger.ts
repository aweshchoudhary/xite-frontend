import dbConnect from "@/modules/common/database/mongodb/connection";
import {
  AuditLogModel,
  type AuditActionType,
  type DatabaseType,
} from "@/modules/common/database/mongodb/models/audit-log";

export interface AuditLogEntry {
  userId: string;
  userName: string;
  userEmail?: string;
  actionType: AuditActionType;
  recordId: string;
  recordName: string;
  recordType: string;
  databaseType: DatabaseType;
  initialValue?: any;
  finalValue?: any;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

/**
 * Creates an audit log entry in MongoDB
 * This function should be called after any CREATE, UPDATE, DELETE, or other actions
 * on both PostgreSQL and MongoDB records
 */
export async function createAuditLog(entry: AuditLogEntry): Promise<void> {
  try {
    await dbConnect();

    await AuditLogModel.create({
      userId: entry.userId,
      userName: entry.userName,
      userEmail: entry.userEmail,
      actionType: entry.actionType,
      recordId: entry.recordId,
      recordName: entry.recordName,
      recordType: entry.recordType,
      databaseType: entry.databaseType,
      initialValue: entry.initialValue,
      finalValue: entry.finalValue,
      ipAddress: entry.ipAddress,
      userAgent: entry.userAgent,
      metadata: entry.metadata,
    });
  } catch (error) {
    // Log error but don't throw - audit logging should not break the main operation
    console.error("Failed to create audit log:", error);
  }
}

/**
 * Helper function to create an audit log for CREATE operations
 */
export async function logCreate(
  userId: string,
  userName: string,
  recordType: string,
  recordId: string,
  recordName: string,
  databaseType: DatabaseType,
  finalValue?: any,
  metadata?: Record<string, any>,
): Promise<void> {
  await createAuditLog({
    userId,
    userName,
    actionType: "CREATE",
    recordType,
    recordId,
    recordName,
    databaseType,
    finalValue,
    metadata,
  });
}

/**
 * Helper function to create an audit log for UPDATE operations
 */
export async function logUpdate(
  userId: string,
  userName: string,
  recordType: string,
  recordId: string,
  recordName: string,
  databaseType: DatabaseType,
  initialValue?: any,
  finalValue?: any,
  metadata?: Record<string, any>,
): Promise<void> {
  await createAuditLog({
    userId,
    userName,
    actionType: "UPDATE",
    recordType,
    recordId,
    recordName,
    databaseType,
    initialValue,
    finalValue,
    metadata,
  });
}

/**
 * Helper function to create an audit log for DELETE operations
 */
export async function logDelete(
  userId: string,
  userName: string,
  recordType: string,
  recordId: string,
  recordName: string,
  databaseType: DatabaseType,
  initialValue?: any,
  metadata?: Record<string, any>,
): Promise<void> {
  await createAuditLog({
    userId,
    userName,
    actionType: "DELETE",
    recordType,
    recordId,
    recordName,
    databaseType,
    initialValue,
    metadata,
  });
}

/**
 * Helper function to create an audit log for APPROVE operations
 */
export async function logApprove(
  userId: string,
  userName: string,
  recordType: string,
  recordId: string,
  recordName: string,
  databaseType: DatabaseType,
  metadata?: Record<string, any>,
): Promise<void> {
  await createAuditLog({
    userId,
    userName,
    actionType: "APPROVE",
    recordType,
    recordId,
    recordName,
    databaseType,
    metadata,
  });
}

/**
 * Helper function to create an audit log for REJECT operations
 */
export async function logReject(
  userId: string,
  userName: string,
  recordType: string,
  recordId: string,
  recordName: string,
  databaseType: DatabaseType,
  metadata?: Record<string, any>,
): Promise<void> {
  await createAuditLog({
    userId,
    userName,
    actionType: "REJECT",
    recordType,
    recordId,
    recordName,
    databaseType,
    metadata,
  });
}

/**
 * Helper function to create an audit log for ARCHIVED operations
 */
export async function logArchive(
  userId: string,
  userName: string,
  recordType: string,
  recordId: string,
  recordName: string,
  databaseType: DatabaseType,
  metadata?: Record<string, any>,
): Promise<void> {
  await createAuditLog({
    userId,
    userName,
    actionType: "ARCHIVED",
    recordType,
    recordId,
    recordName,
    databaseType,
    metadata,
  });
}
