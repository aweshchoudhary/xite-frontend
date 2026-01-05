import UpdateCohortForm from "@/modules/cohort/components/forms/update/form";
import { MODULE_PATH } from "@/modules/cohort/contants";
import { getCohort } from "@/modules/cohort/server/cohort/read";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import UnauthorizedPageError from "@/modules/common/components/global/error/unauthorized-page-error";
import { notFound } from "next/navigation";

interface EditProgramPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Force dynamic rendering since we use auth
export const dynamic = "force-dynamic";

export default async function EditCohortPage({ params }: EditProgramPageProps) {
  const permission = await checkPermission("Cohort", "update");
  if (!permission) {
    return <UnauthorizedPageError />;
  }

  const { id } = await params;
  const cohort = await getCohort({ id });

  if (!cohort) {
    return notFound();
  }

  if (cohort.status === "ACTIVE") {
    return (
      <UnauthorizedPageError message="Cohort is active. You cannot edit it." />
    );
  }

  return (
    <article className="spacing">
      <section>
        <div>
          <h1 className="h1 mb-10">{cohort.name}</h1>
        </div>
      </section>
      <section>
        <UpdateCohortForm
          currentData={{
            ...cohort,
            program_id: cohort.program.id,
            fees: cohort.fees.map((fee) => ({
              ...fee,
              currency_code: fee.currency.code,
              action: "update",
            })),
            format: cohort.format ?? "",
            duration: cohort.duration ?? "",
            location: cohort.location ?? "",
          }}
          successRedirectPath={`${MODULE_PATH}/${cohort.id}`}
          cancelRedirectPath={`${MODULE_PATH}/${cohort.id}`}
        />
      </section>
    </article>
  );
}
