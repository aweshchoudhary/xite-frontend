"use client";
import { Checkbox } from "@/modules/common/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import ColumnSortBtn from "@/modules/common/components/global/data-table/column-sort-btn";
import TableActions from "./table-actions";
import Link from "next/link";
import { GetCohortForTable } from "@/modules/cohort/server/cohort/read";
import { Badge } from "@/modules/common/components/ui/badge";
import { enumDisplay } from "@/modules/common/lib/enum-display";
import { WorkStatus } from "@/modules/common/database";
import { format } from "date-fns";

export const columns: ColumnDef<GetCohortForTable>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <ColumnSortBtn column={column} title="Name" />;
    },
    cell: ({ row }) => (
      <Link className="hover:underline" href={`/cohorts/${row.original.id}`}>
        {row.original.name}
      </Link>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "program.name",
    header: ({ column }) => {
      return <ColumnSortBtn column={column} title="Program" />;
    },
    cell: ({ row }) => (
      <Link
        className="hover:underline"
        href={`/programs/${row.original.program_id}`}
      >
        {row.original.program.name}
      </Link>
    ),
    enableHiding: true,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <ColumnSortBtn column={column} title="Status" />;
    },
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.status === WorkStatus.ACTIVE ? "success" : "secondary"
        }
        size={"sm"}
        className="capitalize border"
      >
        {enumDisplay(row.original.status)}
      </Badge>
    ),
    enableHiding: true,
  },
  {
    id: "start_date",
    accessorKey: "Start Date",
    enableHiding: true,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.start_date
          ? format(row.original.start_date, "MMM d, yyyy")
          : "N/A"}
      </span>
    ),
  },
  {
    id: "end_date",
    accessorKey: "End Date",
    enableHiding: true,
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.end_date
          ? format(row.original.end_date, "MMM d, yyyy")
          : "N/A"}
      </span>
    ),
  },
  {
    id: "actions",
    accessorKey: "actions",
    enableHiding: false,
    header: () => null,
    cell: ({ row }) => <TableActions row={row} />,
  },
];
