import RecordView from "@microsite-cms/template/screens/record";
import { fetchTemplate } from "@microsite-cms/template/screens/record/actions/fetch";
import { notFound } from "next/navigation";
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
      title: "Template Not Found",
      description: "The requested template could not be found on XITE Platform",
    });
  }

  return generateSEOMetadata({
    title: template.name || "Template",
    description: `View template details for ${
      template.name || "this template"
    } on XITE Platform`,
    ogTitle: template.name || "Template",
    ogDescription: `Template: ${
      template.name || "View template"
    } on XITE Platform`,
  });
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const template = await fetchTemplate(id);

  if (!template) {
    notFound();
  }

  return (
    <main>
      <section>
        <div>
          <RecordView template={template} />
        </div>
      </section>
    </main>
  );
}
