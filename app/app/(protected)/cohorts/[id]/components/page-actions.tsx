import CohortStatusUpdate from "@/modules/cohort/components/forms/update/status-update";
import { Button } from "@ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@ui/dropdown-menu";
import { Pencil, TrashIcon, ChevronDownIcon } from "lucide-react";
import { GetCohort } from "@/modules/cohort/server/cohort/read";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import Link from "next/link";

export const HeaderActions = async ({
  data,
  id,
}: {
  data: GetCohort;
  id: string;
}) => {
  const updatePermission = await checkPermission("Cohort", "update");
  const deletePermission = await checkPermission("Cohort", "delete");

  return (
    <>
      <CohortStatusUpdate cohort={data} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={"icon"}>
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit" align="end">
          {updatePermission && (
            <DropdownMenuItem asChild>
              <Link
                href={`/cohorts/${id}/edit`}
                className="flex items-center gap-2"
              >
                <Pencil className="size-3.5" /> Edit
              </Link>
            </DropdownMenuItem>
          )}
          {deletePermission && (
            <DropdownMenuItem className="text-destructive">
              <TrashIcon className="size-3.5 text-inherit" /> Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
