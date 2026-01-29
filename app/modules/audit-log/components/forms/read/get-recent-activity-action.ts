"use server";

import dbConnect from "@/modules/common/database/mongodb/connection";
import { AuditLogModel } from "@/modules/common/database/mongodb/models/audit-log";

export interface RecentActivity {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  actionType: string;
  recordId: string;
  recordName: string;
  recordType: string;
  databaseType: string;
  createdAt: string;
  initialValue?: Record<string, unknown> | null;
  finalValue?: Record<string, unknown> | null;
}

/**
 * Get recent activities for dashboard
 * Accessible to all authenticated users (not admin-only)
 */
export async function getRecentActivitiesAction(
  limit: number = 10,
): Promise<RecentActivity[]> {
  try {
    await dbConnect();

    const data = await AuditLogModel.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select(
        "userId userName userEmail actionType recordId recordName recordType databaseType createdAt initialValue finalValue",
      )
      .lean()
      .exec();

    // Convert MongoDB documents to plain objects with serializable dates
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
      createdAt: doc.createdAt?.toISOString() || new Date().toISOString(),
      initialValue: doc.initialValue as Record<string, unknown> | undefined,
      finalValue: doc.finalValue as Record<string, unknown> | undefined,
    }));

    return plainData;
  } catch (error) {
    console.error("Failed to fetch recent activities:", error);
    return [];
  }
}
