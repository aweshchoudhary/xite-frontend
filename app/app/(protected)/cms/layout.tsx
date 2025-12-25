import { checkPermission } from "@/modules/common/authentication/access-control/lib/check-permission-server";
import UnauthorizedPageError from "@/modules/common/components/global/error/unauthorized-page-error";

export default async function CMSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const permission =
    (await checkPermission("Microsite", "read")) &&
    (await checkPermission("Template", "read"));
  if (!permission) {
    return <UnauthorizedPageError />;
  }
  return <div>{children}</div>;
}
