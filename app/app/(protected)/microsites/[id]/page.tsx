import RecordView from "@microsite-cms/microsite/screens/record";
import { fetchMicrosite } from "@microsite-cms/microsite/screens/record/actions/fetch";
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
    <main>
      <section>
        <div>
          <RecordView microsite={data.microsite} template={data.template} />
        </div>
      </section>
    </main>
  );
}
