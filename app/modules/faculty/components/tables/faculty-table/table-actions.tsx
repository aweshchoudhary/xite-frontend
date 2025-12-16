"use client";
import { GetOneOutput } from "@/modules/faculty/server/read";
import { MODULE_PATH } from "@/modules/faculty/contants";
import DeleteModal from "../../forms/delete/modal";
import PermissionGate from "@/modules/common/authentication/access-control/components/permission-gate";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@ui/button";
import { Row } from "@tanstack/react-table";
import Link from "next/link";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { useRouter } from "next/navigation";

export default function TableActions({ row }: { row: Row<GetOneOutput> }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-fit">
          <PermissionGate resource="Enterprise" action="update">
            <div>
              <Link
                href={`${MODULE_PATH}/${row.original.id}/edit`}
                className="flex items-center gap-2 capitalize w-full py-2 px-4 hover:bg-accent rounded-md"
              >
                <Pencil className="size-4" strokeWidth={1.5} />
                Edit
              </Link>
            </div>
          </PermissionGate>
          <PermissionGate resource="Enterprise" action="delete">
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="text-destructive flex items-center w-full gap-2 py-2 px-4 hover:bg-accent rounded-md cursor-pointer"
            >
              <Trash className="size-4 text-destructive" strokeWidth={1.5} />
              Delete
            </button>
          </PermissionGate>
        </PopoverContent>
      </Popover>
      <DeleteModal
        recordId={row.original.id}
        noTrigger
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        onSuccess={() => router.push(MODULE_PATH)}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}
