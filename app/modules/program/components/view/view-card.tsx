"use client";
import { enumDisplay } from "@/modules/common/lib/enum-display";
import { getImageUrl } from "@/modules/common/lib/utils";
import { Badge } from "@ui/badge";
import { Card, CardContent, CardHeader } from "@ui/card";
import Link from "next/link";
import Image from "next/image";
import {
  ProgramStatus,
  ProgramType,
} from "@/modules/common/database/prisma/generated/prisma";
import PermissionGate from "@/modules/common/authentication/access-control/components/permission-gate";
import {
  Building2,
  CalendarClock,
  GraduationCap,
  PencilIcon,
  School,
  TrashIcon,
  Users,
} from "lucide-react";
import DeleteProgramModal from "../forms/delete/modal";
import { Button } from "@ui/button";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useRouter } from "next/navigation";

type ProgramCardProps = {
  program: {
    id: string;
    name: string;
    status: ProgramStatus;
    type?: ProgramType;
    updated_at?: Date | null;
    academic_partner: {
      name: string;
      logo_url?: string | null;
    };
    _count?: { cohorts: number };
  };
};

export default function ViewCard({ program }: ProgramCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  if (!program) {
    return null;
  }

  const cohortCount = program._count?.cohorts ?? 0;

  return (
    <Card className="transition-colors">
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border">
            {program.academic_partner?.logo_url ? (
              <Image
                src={getImageUrl(program.academic_partner.logo_url)}
                alt={program.academic_partner.name}
                width={36}
                height={36}
                className="size-9 object-contain"
              />
            ) : (
              <GraduationCap className="size-4 text-muted-foreground" strokeWidth={1.5} />
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <h2 className="font-semibold leading-tight">
              <Link
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
                href={`/programs/${program.id}`}
              >
                {program.name}
              </Link>
            </h2>
            {program.academic_partner && (
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                <span className="truncate">{program.academic_partner.name}</span>
              </div>
            )}
          </div>
        </div>
        <Badge
          variant={
            program.status === ProgramStatus.ACTIVE ? "success" : "outline"
          }
          className="shrink-0 capitalize"
        >
          {enumDisplay(program.status)}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground text-xs">
          {program.type != null && (
            <div className="flex items-center gap-1.5">
              <Building2 className="size-3.5 shrink-0" strokeWidth={1.5} />
              <span className="capitalize">{enumDisplay(program.type)}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Users className="size-3.5 shrink-0" strokeWidth={1.5} />
            <span>
              {cohortCount} {cohortCount === 1 ? "cohort" : "cohorts"}
            </span>
          </div>
          {program.updated_at && (
            <div className="flex items-center gap-1.5">
              <CalendarClock className="size-3.5 shrink-0" strokeWidth={1.5} />
              <span>
                Updated {formatDistanceToNow(new Date(program.updated_at), { addSuffix: true })}
              </span>
              <PermissionGate resource="Program" action="update">
                <Link
                  href={`/programs/${program.id}/edit`}
                  className="text-muted-foreground hover:text-foreground ml-0.5 inline-flex items-center gap-1 hover:underline"
                  title="Edit program"
                >
                  <PencilIcon className="size-3.5 shrink-0" strokeWidth={1.5} />
                  <span>Edit</span>
                </Link>
              </PermissionGate>
              {program.status !== ProgramStatus.ACTIVE && (
                <PermissionGate resource="Program" action="delete">
                  <DeleteProgramModal
                    recordId={program.id}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    onSuccess={() => {
                      router.push("/programs");
                      setIsOpen(false);
                    }}
                    onCancel={() => {
                      router.push("/programs");
                      setIsOpen(false);
                    }}
                    trigger={
                      <Button
                        variant="ghost"
                        className="text-muted-foreground hover:text-destructive ml-0.5 inline-flex h-auto items-center gap-1 p-0 font-normal hover:underline"
                        title="Delete program"
                      >
                        <TrashIcon className="size-3.5 shrink-0" strokeWidth={1.5} />
                        <span>Delete</span>
                      </Button>
                    }
                  />
                </PermissionGate>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
