import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ui/breadcrumb";
import ProgramsTable from "@/modules/program/components/tables/program/table";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import UnauthorizedPageError from "@/modules/common/components/global/error/unauthorized-page-error";
import { ProgramStatus } from "@/modules/common/database/prisma/generated/prisma";
import { buttonVariants } from "@ui/button";
import { cn } from "@/modules/common/lib/utils";
import Link from "next/link";
import { Plus } from "lucide-react";
import { MODULE_NAME, MODULE_NAME_PLURAL } from "@/modules/program/contants";
import { generateSEOMetadata } from "@/modules/common/lib/seo";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/modules/common/components/ui/dropdown-menu";
import { Button } from "@/modules/microsite-cms/modules/common/ui/button";

// Force dynamic rendering since we use searchParams and auth
export const dynamic = "force-dynamic";

export const metadata = generateSEOMetadata({
  title: "Programs",
  description:
    "Manage and view all programs on XITE Platform. Create, edit, and track program information.",
});

interface PageProps {
  searchParams: Promise<{
    status?: ProgramStatus;
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
        <ProgramsTable status={status} />
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
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button>
                    <Plus className="size-4" />
                    {MODULE_NAME}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href="/programs/new">
                      B2C
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/programs/new/b2b">
                      B2B
                    </Link>
                  </DropdownMenuItem>
                  
                </DropdownMenuContent>
              </DropdownMenu>
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
          <BreadcrumbPage>Programs</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
