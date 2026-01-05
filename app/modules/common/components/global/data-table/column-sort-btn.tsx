import { ArrowDown } from "lucide-react";

import { Column } from "@tanstack/react-table";
import { ArrowUp } from "lucide-react";

export default function ColumnSortBtn<T>({
  column,
  title,
}: {
  column: Column<T>;
  title: string;
}) {
  return (
    <button
      className="px-0! bg-transparent flex items-center gap-1"
      onClick={() => {
        if (column.getIsSorted() === "asc") {
          column.toggleSorting();
        } else if (column.getIsSorted() === "desc") {
          column.clearSorting();
        } else {
          column.toggleSorting();
        }
      }}
    >
      {title}
      {column.getIsSorted() === "asc" ? (
        <ArrowUp className="size-4" />
      ) : column.getIsSorted() === "desc" ? (
        <ArrowDown className="size-4" />
      ) : null}
    </button>
  );
}
