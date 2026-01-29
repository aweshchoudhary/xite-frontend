"use client";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { MODULE_PATH } from "@/modules/user/contants";
import DeleteModal from "../../forms/delete/modal";
import PermissionGate from "@/modules/common/authentication/access-control/components/permission-gate";
import { MoreHorizontal, Pencil, Trash, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@ui/button";
import { Row } from "@tanstack/react-table";
import Link from "next/link";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { useRouter } from "next/navigation";
import { toggleActiveAction } from "../../forms/toggle-active/action";
import { toast } from "sonner";

export default function TableActions({
  row,
}: {
  row: Row<PrimaryDB.UserGetPayload<{ include: { roles: true } }>>;
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();

  const handleToggleActive = async () => {
    const result = await toggleActiveAction({
      id: row.original.id,
      isActive: !row.original.isActive,
    });

    if (result.data) {
      toast.success(
        `User ${result.data.isActive ? "activated" : "deactivated"} successfully`
      );
      router.refresh();
    }

    if (result.error) {
      toast.error(result.error);
    }
  };

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
          <PermissionGate resource="User" action="update">
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
          <PermissionGate resource="User" action="update">
            <button
              onClick={handleToggleActive}
              className="flex items-center w-full gap-2 py-2 px-4 hover:bg-accent rounded-md cursor-pointer"
            >
              {row.original.isActive ? (
                <>
                  <XCircle className="size-4" strokeWidth={1.5} />
                  Deactivate
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4" strokeWidth={1.5} />
                  Activate
                </>
              )}
            </button>
          </PermissionGate>
          <PermissionGate resource="User" action="delete">
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
        onSuccess={() => router.refresh()}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}
