import { checkPermission } from "@/modules/common/authentication/access-control/lib/check-permission-server";
import UnauthorizedPageError from "@/modules/common/components/global/error/unauthorized-page-error";

export default async function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const permission = await checkPermission("Template", "read");
  if (!permission) {
    return <UnauthorizedPageError />;
  }
  return <div>{children}</div>;
}
