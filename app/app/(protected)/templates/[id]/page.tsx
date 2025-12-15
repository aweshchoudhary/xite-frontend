import RecordView from "@/modules/microsite-cms/modules/template/screens/record";
import { fetchTemplate } from "@/modules/microsite-cms/modules/template/screens/record/actions/fetch";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
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
        <div className="lg:p-10 max-w-5xl mx-auto">
          <RecordView template={template} />
        </div>
      </section>
    </main>
  );
}
