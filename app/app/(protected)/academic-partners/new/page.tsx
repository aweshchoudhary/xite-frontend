import CreateForm from "@/modules/academic-partner/components/forms/create/form";
import { MODULE_PATH } from "@/modules/academic-partner/contants";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import UnauthorizedPageError from "@/modules/common/components/global/error/unauthorized-page-error";
import { generateSEOMetadata } from "@/modules/common/lib/seo";

// Force dynamic rendering since we use auth
export const dynamic = "force-dynamic";

export const metadata = generateSEOMetadata({
  title: "New Academic Partner",
  description:
    "Add a new academic partner to XITE Platform. Set up partner details, logo, and collaboration information.",
});

export default async function NewCohortPage() {
  const permission = await checkPermission("AcademicPartners", "write");

  if (!permission) {
    return <UnauthorizedPageError />;
  }

  return (
    <div className="spacing">
      <section>
        <div className="mb-10">
          <h1 className="h1">New Academic Partner</h1>
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
