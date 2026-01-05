import Update from "@microsite-cms/microsite/screens/update";
import { fetchMicrosite } from "@microsite-cms/microsite/screens/record/actions/fetch";
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
      title: "Edit Microsite",
      description: "Edit microsite on XITE Platform",
    });
  }

  return generateSEOMetadata({
    title: `Edit ${data.microsite.name || "Microsite"}`,
    description: `Edit microsite details for ${
      data.microsite.name || "this microsite"
    } on XITE Platform`,
  });
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

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
