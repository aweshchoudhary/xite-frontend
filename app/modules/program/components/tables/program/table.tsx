"use server";

import DataTableView from "@/modules/common/components/global/data-table/data-table-view";
import { columns } from "./schema";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { Badge } from "@ui/badge";
import { ProgramStatus, ProgramType } from "@/modules/common/database/prisma/generated/prisma";
import { enumDisplay } from "@/modules/common/lib/enum-display";
import Link from "next/link";

type ProgramTableProps = {
  status?: ProgramStatus | "ALL";
  type?: ProgramType;
};

export default async function ProgramTable({
  status = "ALL",
  type,
}: ProgramTableProps) {
  const programs = await primaryDB.program.findMany({
    include: {
      academic_partner: true,
    },
  });

  // Apply type filter first if specified
  const typeFilteredPrograms = type
    ? programs.filter((p) => p.type === type)
    : programs;

  // Precompute counts for all statuses including ALL
  const statusCounts: Record<string, number> = {
    ALL: typeFilteredPrograms.length ?? 0,
  };

  for (const s of Object.values(ProgramStatus)) {
    statusCounts[s] = typeFilteredPrograms.filter((p) => p.status === s).length ?? 0;
  }

  // Filter programs based on selected status
  const filteredPrograms =
    status === "ALL" ? typeFilteredPrograms : typeFilteredPrograms.filter((p) => p.status === status);

  const statuses: (ProgramStatus | "ALL")[] = [
    "ALL",
    ...Object.values(ProgramStatus),
  ];

  const leftActionArea = (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Status:</span>
      {statuses.map((value) => {
        const params = new URLSearchParams();
        params.set("status", value);
        if (type) {
          params.set("type", type);
        }
        const href = `/programs?${params.toString()}`;
        
        return (
          <Badge
            key={value}
            variant={value === status ? "secondary" : "outline"}
            className="capitalize cursor-pointer"
          >
            <Link href={href}>
              {enumDisplay(value)} ({statusCounts[value]})
            </Link>
          </Badge>
        );
      })}
    </div>
  );

  return (
    <>
      <DataTableView
        data={filteredPrograms ?? []}
        columns={columns}
        leftActionArea={leftActionArea}
      />
    </>
  );
}
