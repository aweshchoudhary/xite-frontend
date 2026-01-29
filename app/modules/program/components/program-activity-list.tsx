import {
  getRecentActivitiesAction,
  type RecentActivity,
} from "@/modules/audit-log/components/forms/read/get-recent-activity-action";
import { formatDistanceToNow } from "date-fns";
import { Activity } from "lucide-react";

const MAX_CHANGES_DISPLAY = 2;
const SKIP_KEYS = new Set([
  "id",
  "created_at",
  "updated_at",
  "createdAt",
  "updatedAt",
  "password",
  "token",
]);

function formatFieldName(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .replace(/_/g, " ")
    .trim();
}

function formatDisplayValue(val: unknown): string {
  if (val === null || val === undefined) return "—";
  if (typeof val === "string")
    return val.length > 30 ? `${val.slice(0, 30)}…` : val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (val instanceof Date) return val.toLocaleDateString();
  if (typeof val === "object") return "[…]";
  return String(val);
}

function getActivityChanges(activity: RecentActivity): Array<{ key: string; value: string }> {
  const { actionType, initialValue, finalValue } = activity;
  if (
    actionType === "UPDATE" &&
    initialValue &&
    finalValue &&
    typeof finalValue === "object"
  ) {
    const changed: Array<{ key: string; value: string }> = [];
    const final = finalValue as Record<string, unknown>;
    const initial = (initialValue as Record<string, unknown>) || {};
    for (const [key, val] of Object.entries(final)) {
      if (SKIP_KEYS.has(key)) continue;
      if (
        val !== null &&
        typeof val === "object" &&
        !Array.isArray(val) &&
        !(val instanceof Date)
      )
        continue;
      const prev = initial[key];
      if (JSON.stringify(prev) !== JSON.stringify(val)) {
        changed.push({
          key: formatFieldName(key),
          value: formatDisplayValue(val),
        });
      }
      if (changed.length > MAX_CHANGES_DISPLAY) break;
    }
    return changed;
  }
  if (actionType === "CREATE" && finalValue && typeof finalValue === "object") {
    const entries: Array<{ key: string; value: string }> = [];
    for (const [key, val] of Object.entries(finalValue as Record<string, unknown>)) {
      if (SKIP_KEYS.has(key)) continue;
      if (
        val !== null &&
        typeof val === "object" &&
        !Array.isArray(val) &&
        !(val instanceof Date)
      )
        continue;
      entries.push({ key: formatFieldName(key), value: formatDisplayValue(val) });
    }
    return entries.slice(0, MAX_CHANGES_DISPLAY + 1);
  }
  return [];
}

function ActivityChanges({ activity }: { activity: RecentActivity }) {
  const changes = getActivityChanges(activity);
  if (changes.length === 0) return null;
  return (
    <div className="mt-1 pl-5 space-y-0.5">
      {changes.slice(0, MAX_CHANGES_DISPLAY).map(({ key, value }) => (
        <p key={key} className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground/80">{key}:</span> {value}
        </p>
      ))}
    </div>
  );
}

export default async function ProgramActivityList({ programId }: { programId: string }) {
  const activities = await getRecentActivitiesAction(10, {
    recordId: programId,
    recordType: "Program",
  });

  if (!activities || activities.length === 0) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Activity</h3>
        <p className="text-xs text-muted-foreground">
          No activity yet. Changes to this program will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Activity</h3>
      <div className="space-y-1">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-2 py-2 border-b border-border last:border-0"
          >
            <Activity className="size-3.5 shrink-0 mt-0.5 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">
                {activity.userName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                <span className="text-xs text-muted-foreground">
                  {activity.actionType.toLowerCase()}
                </span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatDistanceToNow(new Date(activity.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <ActivityChanges activity={activity} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
