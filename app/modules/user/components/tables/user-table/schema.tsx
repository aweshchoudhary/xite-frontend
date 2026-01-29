"use client";
import { ColumnDef } from "@tanstack/react-table";
import ColumnSortBtn from "@/modules/common/components/global/data-table/column-sort-btn";
import TableActions from "./table-actions";
import Link from "next/link";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { MODULE_PATH } from "@/modules/user/contants";
import { Badge } from "@ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

export const columns: ColumnDef<
  PrimaryDB.UserGetPayload<{ include: { roles: true } }>
>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <ColumnSortBtn column={column} title="Name" />;
    },
    cell: ({ row }) => (
      <Link
        className="hover:underline gap-2 flex items-center"
        href={`${MODULE_PATH}/${row.original.id}`}
      >
        <Avatar className="size-8">
          {row.original.image && (
            <AvatarImage src={row.original.image} alt={row.original.name || ""} />
          )}
          <AvatarFallback className="uppercase">
            {(row.original.name || row.original.email || "U").slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        {row.original.name || "No Name"}
      </Link>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <ColumnSortBtn column={column} title="Email" />;
    },
  },
  {
    accessorKey: "username",
    header: ({ column }) => {
      return <ColumnSortBtn column={column} title="Username" />;
    },
    cell: ({ row }) => row.original.username || "—",
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.roles.map((role) => (
          <Badge key={role.id} variant="secondary">
            {role.role}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => {
      return <ColumnSortBtn column={column} title="Status" />;
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.isActive ? (
          <>
            <CheckCircle2 className="size-4 text-green-600" />
            <span className="text-green-600">Active</span>
          </>
        ) : (
          <>
            <XCircle className="size-4 text-red-600" />
            <span className="text-red-600">Inactive</span>
          </>
        )}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return <ColumnSortBtn column={column} title="Created" />;
    },
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <TableActions row={row} />,
  },
];
