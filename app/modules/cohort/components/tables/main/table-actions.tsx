"use client";
import type { GetCohortForTable } from "@/modules/cohort/components/forms/read/get-all-for-table-action";
import { MODULE_PATH } from "@/modules/cohort/contants";
import DeleteModal from "../../forms/delete/modal";
import CloneModal from "../../forms/clone/modal";
import PermissionGate from "@/modules/common/authentication/access-control/components/permission-gate";
import { MoreHorizontal, Pencil, Trash, Copy } from "lucide-react";
import { Button } from "@ui/button";
import { Row } from "@tanstack/react-table";
import Link from "next/link";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { useRouter } from "next/navigation";
import { useCheckUserOwnsCohort } from "@/modules/cohort/auth/access";

export default function TableActions({ row }: { row: Row<GetCohortForTable> }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);
  const isUserOwnsCohort = useCheckUserOwnsCohort(row.original.id);
  const router = useRouter();

  return (
    <>
      <div className="flex items-center gap-2">
        <PermissionGate resource="Cohort" action="write">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsCloneModalOpen(true)}
            title="Clone cohort"
          >
            <Copy className="size-4" strokeWidth={1.5} />
            <span className="sr-only">Clone cohort</span>
          </Button>
        </PermissionGate>
        {row.original.status !== "ACTIVE" && isUserOwnsCohort ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-fit">
              <PermissionGate resource="Cohort" action="update">
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
              <PermissionGate resource="Cohort" action="delete">
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
        ) : null}
      </div>
      <DeleteModal
        recordId={row.original.id}
        noTrigger
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        onSuccess={() => router.push(MODULE_PATH)}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
      <CloneModal
        recordId={row.original.id}
        cohortName={row.original.name}
        isOpen={isCloneModalOpen}
        setIsOpen={setIsCloneModalOpen}
        onSuccess={() => router.refresh()}
        onCancel={() => setIsCloneModalOpen(false)}
      />
    </>
  );
}
