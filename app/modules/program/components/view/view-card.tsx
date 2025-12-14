"use client";
import { enumDisplay } from "@/modules/common/lib/enum-display";
import { GetOne } from "../../server/read";
import { Badge } from "@/modules/common/components/ui/badge";
import Link from "next/link";
import { ProgramStatus } from "@/modules/common/database/prisma/generated/prisma";
import PermissionGate from "@/modules/common/authentication/access-control/components/permission-gate";
import { buttonVariants } from "@/modules/common/components/ui/button";
import { Loader, PencilIcon, School, TrashIcon } from "lucide-react";
import DeleteProgramModal from "../forms/delete/modal";
import { Button } from "@/modules/common/components/ui/button";
import { cn } from "@/modules/common/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ViewCard({ program }: { program: GetOne }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  return (
    <div className="bg-background border rounded-md">
      <div className="px-4 py-5 flex items-center gap-4  justify-between">
        <h2 className="font-semibold">
          <Link className="hover:underline" href={`/programs/${program.id}`}>
            {program.name}
          </Link>
        </h2>
        <Badge
          variant={
            program.status === ProgramStatus.ACTIVE ? "success" : "outline"
          }
          className="capitalize flex items-center gap-1"
        >
          {" "}
          <Loader className="size-3.5" /> {enumDisplay(program.status)}
        </Badge>
      </div>
      <div className="px-4 py-2 border-t flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-1 text-muted-foreground truncate text-xs">
          <School className="size-4" strokeWidth={1.5} />{" "}
          {program.academic_partner.name}
        </div>
        {program.status !== ProgramStatus.ACTIVE ? (
          <div className="flex items-center gap-1">
            <PermissionGate resource="Program" action="update">
              <Link
                href={`/programs/${program.id}/edit`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "icon" }),
                  "gap-2"
                )}
              >
                <PencilIcon className="size-3.5" />
              </Link>
            </PermissionGate>

            <PermissionGate resource="Program" action="delete">
              <DeleteProgramModal
                recordId={program.id}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                onSuccess={() => {
                  router.push("/programs");
                  setIsOpen(false);
                }}
                onCancel={() => {
                  router.push("/programs");
                  setIsOpen(false);
                }}
                trigger={
                  <Button
                    variant="outline"
                    className="text-destructive"
                    size="icon"
                  >
                    <TrashIcon className="size-3.5" />
                  </Button>
                }
              />
            </PermissionGate>
          </div>
        ) : null}
      </div>
    </div>
  );
}
