import RecordView from "@microsite-cms/template/screens/record";
import { fetchTemplate } from "@microsite-cms/template/screens/record/actions/fetch";
import { notFound } from "next/navigation";
import { generateSEOMetadata } from "@/modules/common/lib/seo";
import type { Metadata } from "next";
import RecordActivityList from "@/modules/common/components/activity/record-activity-list";
import { Suspense } from "react";

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
    <main className="spacing">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main content: template details */}
        <section className="lg:col-span-9 min-w-0">
          <RecordView template={template} />
        </section>

        {/* Right sidebar: activity history */}
        <aside className="lg:col-span-3 shrink-0">
          <Suspense
            fallback={
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Activity</h3>
                <p className="text-xs text-muted-foreground">Loading…</p>
              </div>
            }
          >
            <RecordActivityList recordId={id} recordType="Template" />
          </Suspense>
        </aside>
      </div>
    </main>
  );
}
