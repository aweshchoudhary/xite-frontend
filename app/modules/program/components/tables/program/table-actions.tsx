"use client";
import type { GetOne } from "@/modules/program/components/forms/read/action";
import { MODULE_PATH } from "@/modules/program/contants";
import DeleteModal from "../../forms/delete/modal";
import { Can } from "@/modules/common/authentication/access-control/abilities/can";
import { useAbility } from "@/modules/common/authentication/access-control/hooks/use-ability";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { Row } from "@tanstack/react-table";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TableActions({ row }: { row: Row<GetOne> }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();
  const { ability, loading } = useAbility();

  const canUpdate = ability?.can("update", "Program");
  const canDelete = ability?.can("delete", "Program");
  const showActions = !loading && (canUpdate || canDelete);

  if (!showActions) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <Can I="update" a="Program">
            <DropdownMenuItem asChild>
              <Link href={`${MODULE_PATH}/${row.original.id}/edit`} className="flex cursor-pointer items-center gap-2">
                <Pencil className="size-4" strokeWidth={1.5} />
                Edit
              </Link>
            </DropdownMenuItem>
          </Can>
          <Can I="delete" a="Program">
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <Trash className="size-4" strokeWidth={1.5} />
              Delete
            </DropdownMenuItem>
          </Can>
        </DropdownMenuContent>
      </DropdownMenu>
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
