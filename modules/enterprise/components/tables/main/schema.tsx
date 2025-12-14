"use client";
import { Checkbox } from "@/modules/common/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import ColumnSortBtn from "@/modules/common/components/global/data-table/column-sort-btn";
import TableActions from "./table-actions";
import { GetOneOutput } from "@/modules/enterprise/server/read";
import Link from "next/link";
import { MODULE_PATH } from "@/modules/enterprise/contants";

export const columns: ColumnDef<GetOneOutput>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <ColumnSortBtn column={column} title="Name" />;
    },
    cell: ({ row }) => (
      <Link
        href={`${MODULE_PATH}/${row.original.id}`}
        className="hover:underline"
      >
        {row.original.name}
      </Link>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "address",
    header: ({ column }) => {
      return <ColumnSortBtn column={column} title="Address" />;
    },
    cell: ({ row }) => (
      <div
        className="truncate"
        dangerouslySetInnerHTML={{ __html: row.original.address || "Not Set" }}
      />
    ),
    enableHiding: true,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <TableActions row={row} />,
  },
];
