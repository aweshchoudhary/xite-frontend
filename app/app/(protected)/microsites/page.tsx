import Microsites from "@microsite-cms/microsite/screens/list";
import { generateSEOMetadata } from "@/modules/common/lib/seo";

export const metadata = generateSEOMetadata({
  title: "Microsites",
  description: "Manage microsites on Xite Platform. Create and configure custom learning sites for your programs and cohorts.",
});

export default function Page() {
  return (
    <main>
      <section>
        <div>
          <Microsites />
        </div>
      </section>
    </main>
  );
}
