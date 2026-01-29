"use client";
import { Badge } from "@ui/badge";
import { Button } from "@ui/button";
import { Card, CardContent, CardHeader } from "@ui/card";
import { WorkStatus } from "@/modules/common/database/prisma/generated/prisma";
import {
  BookOpen,
  CalendarDays,
  Clock,
  GraduationCap,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import Link from "next/link";
import DeleteCohortModal from "../forms/delete/modal";
import { enumDisplay } from "@/modules/common/lib/enum-display";
import PermissionGate from "@/modules/common/authentication/access-control/components/permission-gate";
import { useState } from "react";

type ViewCohortCardProps = {
  cohort: {
    id: string;
    name: string | null;
    status: WorkStatus;
    start_date: Date | null;
    end_date: Date | null;
    program: {
      id: string | null;
      name: string | null;
    } | null;
    updated_at: Date | null;
  };
};

export default function ViewCohortCard({ cohort }: ViewCohortCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const dateRange =
    cohort.start_date || cohort.end_date
      ? [
          cohort.start_date
            ? format(new Date(cohort.start_date), "MMM d, yyyy")
            : "—",
          cohort.end_date
            ? format(new Date(cohort.end_date), "MMM d, yyyy")
            : "—",
        ].join(" – ")
      : null;

  return (
    <Card className="transition-colors hover:bg-muted/30">
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BookOpen className="size-4" strokeWidth={1.5} />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <h2 className="font-semibold leading-tight">
              <Link
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
                href={`/cohorts/${cohort.id}`}
              >
                {cohort.name ?? "Unnamed cohort"}
              </Link>
            </h2>
            {cohort.program?.name && (
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                <GraduationCap className="size-3.5 shrink-0" strokeWidth={1.5} />
                <Link
                  href={cohort.program.id ? `/programs/${cohort.program.id}` : "#"}
                  className="truncate hover:text-foreground hover:underline"
                >
                  {cohort.program.name}
                </Link>
              </div>
            )}
          </div>
        </div>
        <Badge
          variant={cohort.status === WorkStatus.ACTIVE ? "success" : "outline"}
          className="shrink-0 capitalize"
        >
          {enumDisplay(cohort.status)}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground text-xs">
          {dateRange && (
            <div className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5 shrink-0" strokeWidth={1.5} />
              <span>{dateRange}</span>
            </div>
          )}
          {cohort.updated_at && (
            <div className="flex items-center gap-1.5">
              <Clock className="size-3.5 shrink-0" strokeWidth={1.5} />
              <span>
                Updated {formatDistanceToNow(new Date(cohort.updated_at), { addSuffix: true })}
              </span>
              <PermissionGate resource="Cohort" action="update">
                <Link
                  href={`/cohorts/${cohort.id}/edit`}
                  className="text-muted-foreground hover:text-foreground ml-0.5 inline-flex items-center gap-1"
                  title="Edit cohort"
                >
                  <PencilIcon className="size-3.5 shrink-0" strokeWidth={1.5} />
                  <span>Edit</span>
                </Link>
              </PermissionGate>
            </div>
          )}
        </div>
        {cohort.status !== WorkStatus.ACTIVE && (
          <div className="flex justify-end pt-2">
            <PermissionGate resource="Cohort" action="delete">
              <DeleteCohortModal
                recordId={cohort.id}
                trigger={
                  <Button
                    variant="ghost"
                    className="size-8 text-destructive hover:text-destructive"
                    size="icon"
                    title="Delete cohort"
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
        )}
      </CardContent>
    </Card>
  );
}
