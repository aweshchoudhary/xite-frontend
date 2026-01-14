import UpdateCohortForm from "@/modules/cohort/components/forms/update/form";
import { MODULE_PATH } from "@/modules/cohort/contants";
import { getOneForDetailPageAction } from "@/modules/cohort/components/forms/read/get-one-for-detail-page-action";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import UnauthorizedPageError from "@/modules/common/components/global/error/unauthorized-page-error";
import { notFound } from "next/navigation";
import { generateSEOMetadata } from "@/modules/common/lib/seo";
import type { Metadata } from "next";
import { isUserAdmin } from "@/modules/user/utils";

interface EditProgramPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Force dynamic rendering since we use auth
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { data: cohort } = await getOneForDetailPageAction(id);

  if (!cohort) {
    return generateSEOMetadata({
      title: "Edit Cohort",
      description: "Edit cohort on XITE Platform",
    });
  }

  return generateSEOMetadata({
    title: `Edit ${cohort.name || cohort.cohort_key || "Cohort"}`,
    description: `Edit cohort details for ${
      cohort.name || cohort.cohort_key || "this cohort"
    } on XITE Platform`,
  });
}

export default async function EditCohortPage({ params }: EditProgramPageProps) {
  const permission = await checkPermission("Cohort", "update");
  const { id } = await params;
  const { data: cohort } = await getOneForDetailPageAction(id);
  const isAdmin = await isUserAdmin();

  if (!permission || !isAdmin) {
    return <UnauthorizedPageError />;
  }

  if (!cohort) {
    return notFound();
  }

  if (cohort.status === "ACTIVE" && !isAdmin) {
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
            jira_id: cohort.jira_id ?? "",
          }}
          successRedirectPath={`${MODULE_PATH}/${cohort.id}`}
          cancelRedirectPath={`${MODULE_PATH}/${cohort.id}`}
        />
      </section>
    </article>
  );
}
