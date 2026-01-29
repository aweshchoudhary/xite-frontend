import RecordView from "@microsite-cms/microsite/screens/record";
import { fetchMicrosite } from "@microsite-cms/microsite/screens/record/actions/fetch";
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
  const data = await fetchMicrosite(id);

  if (!data || !data.microsite) {
    return generateSEOMetadata({
      title: "Microsite Not Found",
      description:
        "The requested microsite could not be found on XITE Platform",
    });
  }

  return generateSEOMetadata({
    title: data.microsite.name || "Microsite",
    description: `View microsite details for ${
      data.microsite.name || "this microsite"
    } on XITE Platform`,
    ogTitle: data.microsite.name || "Microsite",
    ogDescription: `Microsite: ${
      data.microsite.name || "View microsite"
    } on XITE Platform`,
  });
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const data = await fetchMicrosite(id);

  if (!data || !data.microsite || !data.template) {
    notFound();
  }

  return (
    <main className="spacing">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main content: microsite details */}
        <section className="lg:col-span-9 min-w-0">
          <RecordView microsite={data.microsite} template={data.template} />
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
            <RecordActivityList recordId={id} recordType="Microsite" />
          </Suspense>
        </aside>
      </div>
    </main>
  );
}
