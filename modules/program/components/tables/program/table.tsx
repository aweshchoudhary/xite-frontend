"use server";

import DataTableView from "@/modules/common/components/global/data-table/data-table-view";
import { columns } from "./schema";
import { getAll } from "@/modules/program/server/read";
import { Badge } from "@/modules/common/components/ui/badge";
import { ProgramStatus } from "@/modules/common/database";
import { enumDisplay } from "@/modules/common/lib/enum-display";
import Link from "next/link";

type ProgramTableProps = {
  status?: ProgramStatus | "ALL";
};

export default async function ProgramTable({
  status = "ALL",
}: ProgramTableProps) {
  const { data: programs } = await getAll({});

  // Precompute counts for all statuses including ALL
  const statusCounts: Record<string, number> = {
    ALL: programs?.length ?? 0,
  };

  for (const s of Object.values(ProgramStatus)) {
    statusCounts[s] = programs?.filter((p) => p.status === s).length ?? 0;
  }

  // Filter programs based on selected status
  const filteredPrograms =
    status === "ALL" ? programs : programs?.filter((p) => p.status === status);

  const statuses: (ProgramStatus | "ALL")[] = [
    "ALL",
    ...Object.values(ProgramStatus),
  ];

  const leftActionArea = (
    <div className="flex items-center gap-2 overflow-x-auto">
      {statuses.map((value) => (
        <Badge
          key={value}
          variant={value === status ? "primaryAccent" : "border"}
          className="capitalize cursor-pointer"
        >
          <Link href={`/programs?status=${value}`}>
            {enumDisplay(value)} ({statusCounts[value]})
          </Link>
        </Badge>
      ))}
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
