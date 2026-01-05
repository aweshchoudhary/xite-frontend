import { generateSEOMetadata } from "@/modules/common/lib/seo";

export const metadata = generateSEOMetadata({
  title: "Data Import",
  description: "Import topics and data into Xite Platform",
  noindex: true,
  nofollow: true,
});

export default function DataImportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

