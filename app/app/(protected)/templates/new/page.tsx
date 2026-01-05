import Create from "@microsite-cms/template/screens/create";
import { generateSEOMetadata } from "@/modules/common/lib/seo";

export const metadata = generateSEOMetadata({
  title: "New Template",
  description:
    "Create a new microsite template on XITE Platform. Design and customize templates for your learning sites.",
});

export default function Page() {
  return (
    <main>
      <section>
        <div>
          <Create />
        </div>
      </section>
    </main>
  );
}
