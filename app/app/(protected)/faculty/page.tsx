import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ui/breadcrumb";
import DataTable from "@/modules/faculty/components/tables/faculty-table/table";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import UnauthorizedPageError from "@/modules/common/components/global/error/unauthorized-page-error";
import { buttonVariants } from "@ui/button";
import { cn } from "@/modules/common/lib/utils";
import Link from "next/link";
import { Plus } from "lucide-react";
import { MODULE_NAME, MODULE_NAME_PLURAL } from "@/modules/faculty/contants";

// Force dynamic rendering since we use auth
export const dynamic = "force-dynamic";

export default async function Page() {
  const permission = await checkPermission("Faculty", "read");

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
              <Link href="/faculty/new" className={cn(buttonVariants({}))}>
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
          <BreadcrumbPage>Faculty</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
