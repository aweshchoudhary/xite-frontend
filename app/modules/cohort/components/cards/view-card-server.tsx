import { Badge } from "@/modules/common/components/ui/badge";
import { buttonVariants } from "@/modules/common/components/ui/button";
import {
  Cohort,
  WorkStatus,
} from "@/modules/common/database/prisma/generated/prisma";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/modules/common/lib/utils";
import { format } from "date-fns";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { enumDisplay } from "@/modules/common/lib/enum-display";
import PermissionGate from "@/modules/common/authentication/access-control/components/permission-gate";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import DeleteCohortModalTrigger from "./delete-cohort-modal-trigger";

type ViewCohortCardServerProps = {
  cohort: Cohort;
};

export default async function ViewCohortCardServer({
  cohort,
}: ViewCohortCardServerProps) {
  const hasUpdatePermission = await checkPermission("Cohort", "update");

  if (!hasUpdatePermission) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 bg-background shadow rounded-xl p-4">
      <div className="flex items-center gap-4 flex-wrap justify-between">
        <h2 className="font-semibold">
          <Link className="hover:underline" href={`/cohorts/${cohort.id}`}>
            {cohort.name}
          </Link>
        </h2>
        {cohort.status !== WorkStatus.ACTIVE ? (
          <div className="flex items-center gap-2">
            <PermissionGate resource="Cohort" action="update">
              <Link
                href={`/cohorts/${cohort.id}/edit`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "icon" }),
                  "gap-2"
                )}
              >
                <PencilIcon className="size-4" />
              </Link>
            </PermissionGate>

            <PermissionGate resource="Cohort" action="delete">
              <DeleteCohortModalTrigger cohortId={cohort.id} />
            </PermissionGate>
          </div>
        ) : null}
      </div>
      <div className="flex items-center flex-wrap gap-2">
        <Badge
          variant={cohort.status === WorkStatus.ACTIVE ? "success" : "outline"}
          className="capitalize"
        >
          {enumDisplay(cohort.status)}
        </Badge>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <CalendarIcon className="size-4" />
            {cohort.start_date
              ? format(new Date(cohort.start_date), "MMM d, yyyy")
              : "N/A"}
            {cohort.end_date
              ? ` - ${format(new Date(cohort.end_date), "MMM d, yyyy")}`
              : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
