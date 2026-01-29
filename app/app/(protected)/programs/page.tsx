import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ui/breadcrumb";
import { Button } from "@ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { Card, CardContent} from "@ui/card";
import { Separator } from "@ui/separator";
import ProgramsTable from "@/modules/program/components/tables/program/table";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import UnauthorizedPageError from "@/modules/common/components/global/error/unauthorized-page-error";
import { ProgramStatus, ProgramType } from "@/modules/common/database/prisma/generated/prisma";
import Link from "next/link";
import { ChevronDown, Plus } from "lucide-react";
import { MODULE_NAME, MODULE_NAME_PLURAL } from "@/modules/program/contants";
import { generateSEOMetadata } from "@/modules/common/lib/seo";
import ProgramTypeTabs from "@/modules/program/components/program-type-tabs";

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
    type?: ProgramType;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { status = "ALL", type } = await searchParams;
  const permission = await checkPermission("Program", "read");

  if (!permission) {
    return <UnauthorizedPageError />;
  }
  return (
    <div className="space-y-8">
      <PageHeader />
      <section className="space-y-6">
        <ProgramTypeTabs currentType={type} />
        <Card>
          <CardContent>
            <ProgramsTable status={status} type={type} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

const PageHeader = async () => {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <PageBreadcrumb />
          <h2 className="text-2xl font-semibold text-primary">
            {MODULE_NAME_PLURAL}
          </h2>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-2">
              <Plus className="size-4" />
              {MODULE_NAME}
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem asChild>
              <Link href="/programs/new">B2C</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/programs/new/b2b">B2B</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
