"use client";
import { Button } from "@ui/button";
import {
  ChevronDownIcon,
  Pencil,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { useState } from "react";
import DeleteModal from "@/modules/topic/components/forms/delete/modal";
import { useRouter } from "next/navigation";
import PermissionGate from "@/modules/common/authentication/access-control/components/permission-gate";

export default function HeaderActions({ id }: { id: string }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={"icon"}>
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit" align="end">
          <PermissionGate resource="Topic" action="update">
            <DropdownMenuItem asChild>
              <Link href={`/topics/${id}/edit`}>
                <Pencil className="size-3.5" /> Edit
              </Link>
            </DropdownMenuItem>
          </PermissionGate>
          <PermissionGate resource="Topic" action="delete">
            <DropdownMenuItem
              className="text-destructive"
              onSelect={() => setIsDeleteModalOpen(true)}
            >
              <TrashIcon className="size-3.5 text-inherit" /> Delete
            </DropdownMenuItem>
          </PermissionGate>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteModal
        recordId={id}
        noTrigger
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        onSuccess={() => router.push("/topics")}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}

