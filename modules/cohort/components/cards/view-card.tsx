"use client";
import { Badge } from "@/modules/common/components/ui/badge";
import { Button } from "@/modules/common/components/ui/button";
import { buttonVariants } from "@/modules/common/components/ui/button";
import { Cohort, WorkStatus } from "@/modules/common/database/prisma";
import { CalendarIcon, Loader, TrashIcon } from "lucide-react";
import { cn } from "@/modules/common/lib/utils";
import { format } from "date-fns";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import DeleteCohortModal from "../forms/delete/modal";
import { enumDisplay } from "@/modules/common/lib/enum-display";
import PermissionGate from "@/modules/common/authentication/access-control/components/permission-gate";
import { useHasPermission } from "@/modules/common/authentication/access-control/lib";
import { useState } from "react";
import { useCheckUserOwnsCohort } from "../../auth/access";

type ViewCohortCardProps = {
  cohort: Cohort;
};

export default function ViewCohortCard({ cohort }: ViewCohortCardProps) {
  const hasPermission = useHasPermission("Cohort", "update");
  const isUserOwnsCohort = useCheckUserOwnsCohort(cohort.id);
  const [isOpen, setIsOpen] = useState(false);

  if (!hasPermission) {
    return null;
  }

  return (
    <div className="bg-background border rounded-md">
      <div className="px-4 py-5 flex items-center gap-4  justify-between">
        <h2 className="font-semibold">
          <Link className="hover:underline" href={`/cohorts/${cohort.id}`}>
            {cohort.name}
          </Link>
        </h2>
        <Badge
          variant={cohort.status === WorkStatus.ACTIVE ? "success" : "outline"}
          className="capitalize flex items-center gap-1"
        >
          {" "}
          <Loader className="size-3.5" /> {enumDisplay(cohort.status)}
        </Badge>
      </div>
      <div className="px-4 py-2 border-t flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <CalendarIcon className="size-3.5" />
            {cohort.start_date
              ? format(new Date(cohort.start_date), "MMM d, yyyy")
              : "N/A"}
            {cohort.end_date
              ? ` - ${format(new Date(cohort.end_date), "MMM d, yyyy")}`
              : ""}
          </p>
        </div>
        {cohort.status !== WorkStatus.ACTIVE && isUserOwnsCohort ? (
          <div className="flex items-center gap-1">
            <PermissionGate resource="Cohort" action="update">
              <Link
                href={`/cohorts/${cohort.id}/edit`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "iconSm" }),
                  "gap-2"
                )}
              >
                <PencilIcon className="size-3.5" />
              </Link>
            </PermissionGate>

            <PermissionGate resource="Cohort" action="delete">
              <DeleteCohortModal
                recordId={cohort.id}
                trigger={
                  <Button
                    variant="outline"
                    className="text-destructive"
                    size="iconSm"
                  >
                    <TrashIcon className="size-3.5" />
                  </Button>
                }
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                onSuccess={() => {
                  setIsOpen(false);
                }}
                onCancel={() => {
                  setIsOpen(false);
                }}
              />
            </PermissionGate>
          </div>
        ) : null}
      </div>
    </div>
  );
}
