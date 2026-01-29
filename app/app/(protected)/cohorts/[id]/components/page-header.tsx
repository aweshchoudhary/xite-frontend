import UserSelectPopover from "@/modules/cohort/components/assign-user-list/assign-user-list";
import { PageBreadcrumb } from "./page-breadcrumbs";
import { HeaderActions } from "./page-actions";
import type { GetCohortForDetailPage as GetCohort } from "@/modules/cohort/components/forms/read/get-one-for-detail-page-action";
import { checkUserOwnsCohort, isUserAdmin } from "@/modules/user/utils";

export const PageHeader = async ({ data }: { data: GetCohort }) => {
  const isUserBelongsToCohort = await checkUserOwnsCohort(data.id);
  const isAdmin = await isUserAdmin();

  return (
    <section>
      <PageBreadcrumb title={data.name || ""} />
      <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-4 min-w-0">
          <h1 className="text-2xl font-semibold text-primary truncate">
            {data.name}
          </h1>
        </div>
        {(isUserBelongsToCohort || isAdmin) && (
          <div className="flex items-center gap-2 shrink-0">
            <UserSelectPopover
              cohortId={data.id}
              selectedUserId={data.ownerId || undefined}
            />
            <HeaderActions data={data} id={data.id} />
          </div>
        )}
      </div>
      <div className="border-t mt-6" />
    </section>
  );
};
