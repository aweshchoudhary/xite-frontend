"use client";
import { ColumnDef } from "@tanstack/react-table";
import ColumnSortBtn from "@/modules/common/components/global/data-table/column-sort-btn";
import Link from "next/link";
import { MODULE_PATH } from "@/modules/topic/contants";
import { GetOne } from "../../forms/read/action";

export const columns: ColumnDef<GetOne>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return <ColumnSortBtn column={column} title="Title" />;
    },
    cell: ({ row }) => (
      <Link
        className="hover:underline"
        href={`${MODULE_PATH}/${row.original.id}`}
      >
        {row.original.title}
      </Link>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "sub_topics_count",
    header: ({ column }) => {
      return <ColumnSortBtn column={column} title="Sub Topics" />;
    },
    cell: ({ row }) => (
      <div className="prose truncate line-clamp-1">
        <p>{row.original.sub_topics.length}</p>
      </div>
    ),
  },
];
