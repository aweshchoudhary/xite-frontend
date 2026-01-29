"use server";

import dbConnect from "@/modules/common/database/mongodb/connection";
import { AuditLogModel } from "@/modules/common/database/mongodb/models/audit-log";
import { requireAccess } from "@/modules/common/authentication/access-control/middleware/check-access";

export interface AuditLogFilters {
  userId?: string;
  actionType?: string;
  recordType?: string;
  databaseType?: string;
  startDate?: Date;
  endDate?: Date;
  searchTerm?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface GetAuditLogsResult {
  data: any[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Get all audit logs with filtering and pagination
 * Only accessible by admins
 */
export async function getAuditLogsAction(
  filters: AuditLogFilters = {},
  pagination: PaginationParams = {},
): Promise<GetAuditLogsResult> {
  try {
    // Check if user has admin access
    await requireAccess("manage", "all");

    await dbConnect();

    const page = pagination.page || 1;
    const limit = pagination.limit || 50;
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};

    if (filters.userId) {
      query.userId = filters.userId;
    }

    if (filters.actionType) {
      query.actionType = filters.actionType;
    }

    if (filters.recordType) {
      query.recordType = filters.recordType;
    }

    if (filters.databaseType) {
      query.databaseType = filters.databaseType;
    }

    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) {
        query.createdAt.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.createdAt.$lte = filters.endDate;
      }
    }

    if (filters.searchTerm) {
      query.$or = [
        { userName: { $regex: filters.searchTerm, $options: "i" } },
        { recordName: { $regex: filters.searchTerm, $options: "i" } },
        { userEmail: { $regex: filters.searchTerm, $options: "i" } },
      ];
    }

    // Get total count
    const total = await AuditLogModel.countDocuments(query);

    // Get paginated results
    const data = await AuditLogModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    // Convert MongoDB documents to plain objects
    const plainData = data.map((doc) => ({
      id: doc._id.toString(),
      userId: doc.userId,
      userName: doc.userName,
      userEmail: doc.userEmail,
      actionType: doc.actionType,
      recordId: doc.recordId,
      recordName: doc.recordName,
      recordType: doc.recordType,
      databaseType: doc.databaseType,
      initialValue: doc.initialValue,
      finalValue: doc.finalValue,
      ipAddress: doc.ipAddress,
      userAgent: doc.userAgent,
      metadata: doc.metadata,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));

    const totalPages = Math.ceil(total / limit);

    return {
      data: plainData,
      total,
      page,
      totalPages,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Get audit logs for a specific record
 */
export async function getRecordAuditLogsAction(
  recordId: string,
  recordType: string,
): Promise<any[]> {
  try {
    // Check if user has admin access
    await requireAccess("manage", "all");

    await dbConnect();

    const data = await AuditLogModel.find({
      recordId,
      recordType,
    })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    // Convert MongoDB documents to plain objects
    const plainData = data.map((doc) => ({
      id: doc._id.toString(),
      userId: doc.userId,
      userName: doc.userName,
      userEmail: doc.userEmail,
      actionType: doc.actionType,
      recordId: doc.recordId,
      recordName: doc.recordName,
      recordType: doc.recordType,
      databaseType: doc.databaseType,
      initialValue: doc.initialValue,
      finalValue: doc.finalValue,
      ipAddress: doc.ipAddress,
      userAgent: doc.userAgent,
      metadata: doc.metadata,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));

    return plainData;
  } catch (error) {
    throw error;
  }
}

/**
 * Get audit log statistics
 */
export async function getAuditLogStatsAction(): Promise<any> {
  try {
    // Check if user has admin access
    await requireAccess("manage", "all");

    await dbConnect();

    const [
      totalLogs,
      logsByAction,
      logsByRecordType,
      logsByDatabase,
      recentActivity,
    ] = await Promise.all([
      AuditLogModel.countDocuments(),
      AuditLogModel.aggregate([
        {
          $group: {
            _id: "$actionType",
            count: { $sum: 1 },
          },
        },
      ]),
      AuditLogModel.aggregate([
        {
          $group: {
            _id: "$recordType",
            count: { $sum: 1 },
          },
        },
      ]),
      AuditLogModel.aggregate([
        {
          $group: {
            _id: "$databaseType",
            count: { $sum: 1 },
          },
        },
      ]),
      AuditLogModel.find().sort({ createdAt: -1 }).limit(10).lean().exec(),
    ]);

    return {
      totalLogs,
      logsByAction,
      logsByRecordType,
      logsByDatabase,
      recentActivity: recentActivity.map((doc) => ({
        id: doc._id.toString(),
        userName: doc.userName,
        actionType: doc.actionType,
        recordName: doc.recordName,
        recordType: doc.recordType,
        createdAt: doc.createdAt,
      })),
    };
  } catch (error) {
    throw error;
  }
}
