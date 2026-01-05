import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/modules/common/components/ui/breadcrumb";
import Create from "@microsite-cms/microsite/screens/create";
import { generateSEOMetadata } from "@/modules/common/lib/seo";

export const metadata = generateSEOMetadata({
  title: "New Microsite",
  description:
    "Create a new microsite on XITE Platform. Set up custom learning sites for your programs and cohorts.",
});

export default async function Page() {
  return (
    <main>
      <section className="space-y-6">
        <PageBreadcrumb />
        <div>
          <Create />
        </div>
      </section>
    </main>
  );
}

const PageBreadcrumb = () => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/cms">CMS</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/cms?tab=microsites">
            External Websites
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Create External Website</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
