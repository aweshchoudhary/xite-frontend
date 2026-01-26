import CreateForm from "@/modules/program/components/forms/create-b2b/form";
import { MODULE_PATH } from "@/modules/program/contants";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import UnauthorizedPageError from "@/modules/common/components/global/error/unauthorized-page-error";
import { generateSEOMetadata } from "@/modules/common/lib/seo";

// Force dynamic rendering since we use auth
export const dynamic = "force-dynamic";

export const metadata = generateSEOMetadata({
  title: "New Program",
  description:
    "Create a new program on XITE Platform. Set up program details, academic partnerships, and configurations.",
});

export default async function NewCohortPage() {
  const permission = await checkPermission("Program", "write");

  if (!permission) {
    return <UnauthorizedPageError />;
  }

  return (
    <div className="spacing max-w-5xl mx-auto">
      <section className="mb-8">
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-semibold text-foreground">New B2B Program</h1>
        </div>
      </section>
      <section>
        <CreateForm
          cancelRedirectPath={MODULE_PATH}
          successRedirectPath={MODULE_PATH}
        />
      </section>
    </div>
  );
}
