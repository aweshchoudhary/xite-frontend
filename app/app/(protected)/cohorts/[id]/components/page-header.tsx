import UserSelectPopover from "@/modules/cohort/components/assign-user-list/assign-user-list";
import { PageBreadcrumb } from "./page-breadcrumbs";
import { HeaderActions } from "./page-actions";
import { GetCohort } from "@/modules/cohort/server/cohort/read";
import { checkUserOwnsCohort } from "@/modules/user/utils";

export const PageHeader = async ({ data }: { data: GetCohort }) => {
  const isUserBelongsToCohort = await checkUserOwnsCohort(data.id);

  return (
    <section>
      <div>
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div>
                <PageBreadcrumb title={data.name || ""} />
              </div>
              <h1 className="h1 font-medium text-primary">{data.name}</h1>
            </div>
            {isUserBelongsToCohort && (
              <div className="flex items-center gap-2">
                <UserSelectPopover
                  cohortId={data.id}
                  selectedUserId={data.ownerId || undefined}
                />
                <HeaderActions data={data} id={data.id} />
              </div>
            )}
          </div>
          <hr className="border-gray-200" />
        </div>
      </div>
    </section>
  );
};
