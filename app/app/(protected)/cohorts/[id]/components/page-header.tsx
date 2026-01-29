import UserSelectPopover from "@/modules/cohort/components/assign-user-list/assign-user-list";
import { PageBreadcrumb } from "./page-breadcrumbs";
import { HeaderActions } from "./page-actions";
import type { GetCohortForDetailPage as GetCohort } from "@/modules/cohort/components/forms/read/get-one-for-detail-page-action";
import { checkUserOwnsCohort, isUserAdmin } from "@/modules/user/utils";
import Link from "next/link";
import { Badge } from "@ui/badge";
import { enumDisplay } from "@/modules/common/lib/enum-display";
import { cn } from "@/modules/common/lib/utils";

export const PageHeader = async ({ data }: { data: GetCohort }) => {
  const isUserBelongsToCohort = await checkUserOwnsCohort(data.id);
  const isAdmin = await isUserAdmin();
  const program = data.program;
  const programHref = program?.id ? `/programs/${program.id}` : null;

  return (
    <section>
      <PageBreadcrumb title={data.name || ""} />
      <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-4 min-w-0">
          <div>
            <h1 className="text-2xl font-semibold text-primary truncate">
              {data.name}
            </h1>
            {program && (
              <Link
                href={programHref ?? "#"}
                className={cn(
                  "inline-flex items-center gap-2 mt-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors",
                  !programHref && "pointer-events-none"
                )}
              >
                <span className="truncate">{program.name}</span>
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge
            variant={data.status === "ACTIVE" ? "success" : "outline"}
            className="capitalize"
          >
            {enumDisplay(data.status)}
          </Badge>
          {(isUserBelongsToCohort || isAdmin) && (
            <>
              <UserSelectPopover
                cohortId={data.id}
                selectedUserId={data.ownerId || undefined}
              />
              <HeaderActions data={data} id={data.id} />
            </>
          )}
        </div>
      </div>
      <div className="border-t mt-6" />
    </section>
  );
};
