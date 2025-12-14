import CohortStatusUpdate from "@/modules/cohort/components/forms/update/status-update";
import { Button } from "@/modules/common/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/modules/common/components/ui/dropdown-menu";
import { Link, Pencil, TrashIcon, ChevronDownIcon } from "lucide-react";
import { GetCohort } from "@/modules/cohort/server/cohort/read";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import { checkUserOwnsCohort } from "@/modules/user/utils";

export const HeaderActions = async ({
  data,
  id,
}: {
  data: GetCohort;
  id: string;
}) => {
  const updatePermission = await checkPermission("Program", "update");
  const deletePermission = await checkPermission("Program", "delete");

  const isUserHasCohortAccess = await checkUserOwnsCohort(id);

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
          <DropdownMenuItem asChild>
            <Link href={`/cohorts/${id}/edit`}>
              <Pencil className="size-3.5" /> Edit
            </Link>
          </DropdownMenuItem>
          {/* <DropdownMenuItem className="text-destructive">
              <TrashIcon className="size-3.5 text-inherit" /> Delete
            </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
