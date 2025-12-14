"use client";
import { Checkbox } from "@/modules/common/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import ColumnSortBtn from "@/modules/common/components/global/data-table/column-sort-btn";
import TableActions from "./table-actions";
import Link from "next/link";
import { GetOneOutput } from "@/modules/faculty/server/read";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/modules/common/components/ui/avatar";
import { MODULE_PATH } from "@/modules/faculty/contants";
import { getImageUrl } from "@/modules/common/lib/utils";

export const columns: ColumnDef<GetOneOutput>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <ColumnSortBtn column={column} title="Faculty" />;
    },
    cell: ({ row }) => (
      <Link
        className="hover:underline gap-2 flex items-center"
        href={`${MODULE_PATH}/${row.original.id}`}
      >
        <Avatar className="size-8">
          {row.original.profile_image && (
            <AvatarImage
              src={getImageUrl(row.original.profile_image)}
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
    accessorKey: "email",
    header: ({ column }) => {
      return <ColumnSortBtn column={column} title="Email" />;
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return <ColumnSortBtn column={column} title="Phone" />;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <TableActions row={row} />,
  },
];
