import { getRecentActivitiesAction } from "@/modules/audit-log/components/forms/read/get-recent-activity-action";
import { Badge } from "@/modules/common/components/ui/badge";
import { Separator } from "@/modules/common/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { ArrowRight, Activity } from "lucide-react";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";

const actionTypeColors: Record<string, string> = {
  CREATE: "bg-green-500",
  UPDATE: "bg-blue-500",
  DELETE: "bg-red-500",
  APPROVE: "bg-purple-500",
  REJECT: "bg-orange-500",
  ARCHIVED: "bg-gray-500",
  RESTORE: "bg-cyan-500",
  PUBLISH: "bg-indigo-500",
  UNPUBLISH: "bg-yellow-500",
};

const databaseTypeColors: Record<string, string> = {
  postgresql: "bg-blue-600",
  mongodb: "bg-green-600",
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

      <div className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="shrink-0 mt-1">
              <Badge
                className={`${
                  actionTypeColors[activity.actionType]
                } text-white hover:opacity-80`}
              >
                {activity.actionType}
              </Badge>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {activity.userName}
                  </p>
                  {activity.userEmail && (
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.userEmail}
                    </p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatDistanceToNow(new Date(activity.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs font-mono">
                  {activity.recordType}
                </Badge>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground truncate">
                  {activity.recordName}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <Badge
                  className={`${
                    databaseTypeColors[activity.databaseType]
                  } text-white hover:opacity-80 text-xs uppercase`}
                >
                  {activity.databaseType}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
