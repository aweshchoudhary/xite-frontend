import Templates from "@microsite-cms/template/screens/list";
import { generateSEOMetadata } from "@/modules/common/lib/seo";

export const metadata = generateSEOMetadata({
  title: "Templates",
  description: "Manage microsite templates on Xite Platform. Create and customize templates for your learning sites.",
});

export default function Page() {
  return (
    <main>
      <section>
        <div className="lg:p-10 max-w-6xl mx-auto">
          <Templates />
        </div>
      </section>
    </main>
  );
}
