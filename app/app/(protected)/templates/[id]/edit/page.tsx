import { isUserAdmin } from "@/modules/user/utils";
import Update from "@microsite-cms/template/screens/update";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
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
        <div className="lg:p-10 max-w-5xl mx-auto">
          <Update id={id} />
        </div>
      </section>
    </main>
  );
}
