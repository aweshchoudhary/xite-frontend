import CreateForm from "@/modules/program/components/forms/create/form";
import { MODULE_PATH } from "@/modules/program/contants";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import UnauthorizedPageError from "@/modules/common/components/global/error/unauthorized-page-error";

// Force dynamic rendering since we use auth
export const dynamic = 'force-dynamic';

export default async function NewCohortPage() {
  const permission = await checkPermission("Program", "write");

  if (!permission) {
    return <UnauthorizedPageError />;
  }

  return (
    <div className="spacing">
      <section>
        <div className="mb-10">
          <h1 className="h1">New Program</h1>
        </div>
      </section>
      <section>
        <div>
          <CreateForm
            cancelRedirectPath={MODULE_PATH}
            successRedirectPath={MODULE_PATH}
          />
        </div>
      </section>
    </div>
  );
}
