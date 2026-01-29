import { getRecentActivitiesAction } from "@/modules/audit-log/components/forms/read/get-recent-activity-action";
import { Badge } from "@/modules/common/components/ui/badge";
import { Separator } from "@/modules/common/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { 
  ArrowRight, 
  Activity,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Archive,
  RotateCcw,
  Upload,
  Download
} from "lucide-react";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import type { LucideIcon } from "lucide-react";

const actionIcons: Record<string, LucideIcon> = {
  CREATE: Plus,
  UPDATE: Edit,
  DELETE: Trash2,
  APPROVE: CheckCircle,
  REJECT: XCircle,
  ARCHIVED: Archive,
  RESTORE: RotateCcw,
  PUBLISH: Upload,
  UNPUBLISH: Download,
};

const actionColors: Record<string, string> = {
  CREATE: "text-green-600",
  UPDATE: "text-blue-600",
  DELETE: "text-red-600",
  APPROVE: "text-purple-600",
  REJECT: "text-orange-600",
  ARCHIVED: "text-gray-600",
  RESTORE: "text-cyan-600",
  PUBLISH: "text-indigo-600",
  UNPUBLISH: "text-yellow-600",
};

export default async function RecentActivity() {
  const activities = await getRecentActivitiesAction(10);
  const isAdmin = await checkPermission("all", "manage");

  if (!activities || activities.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          {isAdmin && (
            <Link
              href="/audit-logs"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              View More <ArrowRight className="size-4" strokeWidth={1.5} />
            </Link>
          )}
        </div>
        <Separator className="my-3" />
        <div className="border-2 border-spacing-3 border-dashed bg-background px-5 py-8 rounded-lg">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <Activity className="size-8 text-muted-foreground/50" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                No Recent Activity
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Activity will appear here when users make changes
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        {isAdmin && (
          <Link
            href="/audit-logs"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            View More <ArrowRight className="size-4" strokeWidth={1.5} />
          </Link>
        )}
      </div>

      <Separator className="my-3" />

      <div className="space-y-2">
        {activities.map((activity) => {
          const Icon = actionIcons[activity.actionType] || Activity;
          const iconColor = actionColors[activity.actionType] || "text-gray-600";
          
          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 py-2 hover:bg-muted/30 transition-colors rounded-md px-2 -mx-2"
            >
              <div className={`shrink-0 mt-0.5 ${iconColor}`}>
                <Icon className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {activity.userName}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        {activity.actionType.toLowerCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <Badge variant="outline" className="text-xs font-mono h-5 px-1.5">
                        {activity.recordType}
                      </Badge>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground truncate">
                        {activity.recordName}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatDistanceToNow(new Date(activity.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
