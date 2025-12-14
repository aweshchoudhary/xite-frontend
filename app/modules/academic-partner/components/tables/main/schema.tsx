"use client";
import { Checkbox } from "@/modules/common/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import ColumnSortBtn from "@/modules/common/components/global/data-table/column-sort-btn";
import TableActions from "./table-actions";
import Link from "next/link";
import { GetOne } from "@/modules/academic-partner/server/read";
import { MODULE_PATH } from "@/modules/academic-partner/contants";
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
      <Link
        className="hover:underline gap-2 flex items-center"
        href={`${MODULE_PATH}/${row.original.id}`}
      >
        <Avatar className="size-10 border">
          {row.original.logo_url && (
            <AvatarImage
              src={getImageUrl(row.original.logo_url)}
              alt={row.original.name}
            />
          )}
          <AvatarFallback className="uppercase">
            {row.original.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        {row.original.name}
      </Link>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "total-programs",
    header: ({ column }) => {
      return <ColumnSortBtn column={column} title="Total Programs" />;
    },
    cell: ({ row }) => (
      <div className="prose  prose-a:text-blue-800 truncate line-clamp-1">
        <p>{row.original.programs.length}</p>
      </div>
    ),
  },
  {
    accessorKey: "total-faculties",
    header: ({ column }) => {
      return <ColumnSortBtn column={column} title="Total Faculty" />;
    },
    cell: ({ row }) => (
      <div className="prose  prose-a:text-blue-800 truncate line-clamp-1">
        <p>{row.original.faculties.length}</p>
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <TableActions row={row} />,
  },
];
