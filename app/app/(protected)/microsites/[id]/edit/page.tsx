import Update from "@microsite-cms/microsite/screens/update";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <main>
      <section>
        <div className="lg:p-10 max-w-5xl mx-auto">
          <Update id={id} />
        </div>
      </section>
    </main>
  );
}
