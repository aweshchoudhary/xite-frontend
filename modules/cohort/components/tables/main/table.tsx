"use server";

import DataTableView from "@/modules/common/components/global/data-table/data-table-view";
import { columns } from "./schema";
import {
  getAll,
  getAllByStatus,
  GetCohortForTable,
} from "@/modules/cohort/server/cohort/read";
import { WorkStatus } from "@/modules/common/database/prisma";
import Link from "next/link";
import { enumDisplay } from "@/modules/common/lib/enum-display";
import { Badge } from "@/modules/common/components/ui/badge";

interface CohortTableProps {
  status?: WorkStatus | "ALL";
}

export default async function CohortTable({
  status = "ALL",
}: CohortTableProps) {
  const cohorts: GetCohortForTable[] = await getAllByStatus(status);
  const allCohorts: GetCohortForTable[] = await getAll();

  // Precompute counts
  const statusCounts: Record<string, number> = {
    ALL: allCohorts.length,
  };

  for (const s of Object.values(WorkStatus)) {
    statusCounts[s] = allCohorts.filter((cohort) => cohort.status === s).length;
  }

  const statuses: (WorkStatus | "ALL")[] = [
    "ALL",
    ...Object.values(WorkStatus),
  ];

  const leftActionArea = (
    <div className="flex items-center flex-1 gap-2 overflow-x-auto mb-4">
      {statuses.map((value) => (
        <Badge
          key={value}
          variant={value === status ? "primaryAccent" : "border"}
          className="capitalize cursor-pointer"
        >
          <Link href={`/cohorts?status=${value}`}>
            {enumDisplay(value)} ({statusCounts[value]})
          </Link>
        </Badge>
      ))}
    </div>
  );

  return (
    <>
      <DataTableView
        data={cohorts}
        columns={columns}
        leftActionArea={leftActionArea}
      />
    </>
  );
}
