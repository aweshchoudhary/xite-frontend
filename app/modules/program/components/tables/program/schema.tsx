"use client";
import { ColumnDef } from "@tanstack/react-table";
import ColumnSortBtn from "@/modules/common/components/global/data-table/column-sort-btn";
import TableActions from "./table-actions";
import Link from "next/link";
import type { GetOne } from "@/modules/program/components/forms/read/action";
import { Badge } from "@ui/badge";
import { enumDisplay } from "@/modules/common/lib/enum-display";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { getImageUrl } from "@/modules/common/lib/utils";

export const columns: ColumnDef<GetOne>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <ColumnSortBtn column={column} title="Name" />;
    },
    cell: ({ row }) => (
      <Link className="hover:underline" href={`/programs/${row.original.id}`}>
        {row.original.name}
      </Link>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <ColumnSortBtn column={column} title="Status" />;
    },
    cell: ({ row }) => {
      return (
        <Badge
          className="capitalize"
          variant={row.original.status === "ACTIVE" ? "success" : "outline"}
        >
          {enumDisplay(row.original.status)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "academic_partner.name",
    header: ({ column }) => {
      return <ColumnSortBtn column={column} title="Academic Partner" />;
    },
    cell: ({ row }) =>
      row.original.academic_partner_id ? (
        <Link
          className="hover:underline gap-2 flex items-center"
          href={`/academic-partners/${row.original.academic_partner_id}`}
        >
          <Avatar className="size-7 border">
            <AvatarFallback className="uppercase">
              {row.original.academic_partner?.name?.slice(0, 2) || "AP"}
            </AvatarFallback>
          </Avatar>
          {row.original.academic_partner?.name}
        </Link>
      ) : (
        "NA"
      ),
  },
  {
    accessorKey: "enterprise.name",
    header: ({ column }) => {
      return <ColumnSortBtn column={column} title="Enterprise" />;
    },
    cell: ({ row }) =>
      row.original.enterprise_id ? (
        <Link
          className="hover:underline gap-2 flex items-center"
          href={`/enterprises/${row.original.enterprise_id}`}
        >
          {row.original.enterprise_id}
        </Link>
      ) : (
        "NA"
      ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return <ColumnSortBtn column={column} title="Type" />;
    },
    cell: ({ row }) => {
      return (
        <Badge className="capitalize" variant="outline">
          {enumDisplay(row.original.type)}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <TableActions row={row} />,
  },
];
