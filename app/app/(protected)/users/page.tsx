import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ui/breadcrumb";
import DataTable from "@/modules/user/components/tables/user-table/table";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import UnauthorizedPageError from "@/modules/common/components/global/error/unauthorized-page-error";
import { buttonVariants } from "@ui/button";
import { cn } from "@/modules/common/lib/utils";
import Link from "next/link";
import { Plus } from "lucide-react";
import { MODULE_NAME, MODULE_NAME_PLURAL } from "@/modules/user/contants";
import { generateSEOMetadata } from "@/modules/common/lib/seo";

// Force dynamic rendering since we use auth
export const dynamic = "force-dynamic";

export const metadata = generateSEOMetadata({
  title: "Users",
  description:
    "Manage and view all users on XITE Platform. Add, edit, and manage user roles and permissions.",
});

export default async function Page() {
  const permission = await checkPermission("User", "read");

  if (!permission) {
    return <UnauthorizedPageError />;
  }
  return (
    <div className="spacing space-y-10">
      <PageHeader />
      <section>
        <DataTable />
      </section>
    </div>
  );
}

const PageHeader = async () => {
  return (
    <section>
      <div>
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div>
                <PageBreadcrumb />
              </div>
              <h1 className="h1 font-medium text-primary">
                All {MODULE_NAME_PLURAL}
              </h1>
            </div>
            <div>
              <Link href="/users/new" className={cn(buttonVariants({}))}>
                <Plus className="size-4" />
                {MODULE_NAME}
              </Link>
            </div>
          </div>
          <hr className="border-gray-200" />
        </div>
      </div>
    </section>
  );
};

const PageBreadcrumb = () => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Users</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
