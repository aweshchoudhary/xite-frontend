import { isUserAdmin } from "@/modules/user/utils";
import Update from "@microsite-cms/template/screens/update";
import { fetchTemplate } from "@microsite-cms/template/screens/record/actions/fetch";
import { generateSEOMetadata } from "@/modules/common/lib/seo";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const template = await fetchTemplate(id);

  if (!template) {
    return generateSEOMetadata({
      title: "Edit Template",
      description: "Edit template on Xite Platform",
    });
  }

  return generateSEOMetadata({
    title: `Edit ${template.name || "Template"}`,
    description: `Edit template details for ${template.name || "this template"} on Xite Platform`,
  });
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const isAdmin = await isUserAdmin();

  if (!isAdmin) {
    return <div>You are not authorized to access this page</div>;
  }

  return (
    <main>
      <section>
        <div>
          <Update id={id} />
        </div>
      </section>
    </main>
  );
}
