import Create from "@microsite-cms/microsite/screens/create";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ cohort_key: string }>;
}) {
  const { cohort_key } = await searchParams;
  return (
    <main>
      <section>
        <div className="lg:p-10 max-w-5xl mx-auto">
          <Create cohort_key={cohort_key} />
        </div>
      </section>
    </main>
  );
}
