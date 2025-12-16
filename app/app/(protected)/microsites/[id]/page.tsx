import RecordView from "@microsite-cms/microsite/screens/record";
import { fetchMicrosite } from "@microsite-cms/microsite/screens/record/actions/fetch";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
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
        <div className="lg:p-10 max-w-5xl mx-auto">
          <RecordView microsite={data.microsite} template={data.template} />
        </div>
      </section>
    </main>
  );
}
