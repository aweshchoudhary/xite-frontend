"use client";
import { ColumnDef } from "@tanstack/react-table";
import ColumnSortBtn from "@/modules/common/components/global/data-table/column-sort-btn";
import TableActions from "./table-actions";
import Link from "next/link";
import { GetOne } from "@/modules/program/server/read";
import { Badge } from "@/modules/common/components/ui/badge";
import { enumDisplay } from "@/modules/common/lib/enum-display";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/modules/common/components/ui/avatar";
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
          href={`/academic-partners/${row.original.academic_partner?.id}`}
        >
          <Avatar className="size-7 border">
            {row.original.academic_partner?.logo_url && (
              <AvatarImage
                src={getImageUrl(row.original.academic_partner?.logo_url)}
                alt={row.original.academic_partner?.name}
              />
            )}
            <AvatarFallback className="uppercase">
              {row.original.academic_partner?.name.slice(0, 2)}
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
          href={`/enterprises/${row.original.enterprise?.id}`}
        >
          {row.original.enterprise?.name}
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
