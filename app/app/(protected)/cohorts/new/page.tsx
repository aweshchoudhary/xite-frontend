import CreateForm from "@/modules/cohort/components/forms/create/form";
import { MODULE_PATH } from "@/modules/cohort/contants";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import UnauthorizedPageError from "@/modules/common/components/global/error/unauthorized-page-error";

// Force dynamic rendering since we use searchParams and auth
export const dynamic = "force-dynamic";

export default async function NewCohortPage({
  searchParams,
}: {
  searchParams: Promise<{ program_id: string }>;
}) {
  const { program_id } = await searchParams;
  const permission = await checkPermission("Cohort", "write");

  if (!permission) {
    return <UnauthorizedPageError />;
  }

  return (
    <div className="spacing">
      <section>
        <div className="mb-10">
          <h1 className="h1">New Cohort</h1>
        </div>
      </section>
      <section>
        <div>
          <CreateForm
            defaultValues={{
              program_id,
            }}
            cancelRedirectPath={MODULE_PATH}
            // successRedirectPath={MODULE_PATH}
          />
        </div>
      </section>
    </div>
  );
}
