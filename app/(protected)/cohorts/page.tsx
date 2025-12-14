import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/modules/common/components/ui/breadcrumb";
import DataTable from "@/modules/cohort/components/tables/main/table";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import UnauthorizedPageError from "@/modules/common/components/global/error/unauthorized-page-error";
import { WorkStatus } from "@/modules/common/database";
import { buttonVariants } from "@/modules/common/components/ui/button";
import { cn } from "@/modules/common/lib/utils";
import Link from "next/link";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { MODULE_NAME, MODULE_NAME_PLURAL } from "@/modules/cohort/contants";

// Force dynamic rendering since we use searchParams and auth
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    status?: WorkStatus;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { status = "ALL" } = await searchParams;
  const permission = await checkPermission("Program", "read");

  if (!permission) {
    return <UnauthorizedPageError />;
  }
  return (
    <div className="spacing space-y-10">
      <PageHeader />
      <section>
        <DataTable status={status} />
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
              <Link href="/cohorts/new" className={cn(buttonVariants({}))}>
                <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
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
          <BreadcrumbPage>Cohorts</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
