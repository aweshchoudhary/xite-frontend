import { GetOne, getOne } from "@/modules/program/server/read";
import { Button, buttonVariants } from "@ui/button";
import {
  AlignJustify,
  ChevronDownIcon,
  Key,
  Layers,
  Loader,
  Pencil,
  Plus,
  School,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/modules/common/lib/utils";
import { notFound } from "next/navigation";
import UpdateStatusBtn from "@/modules/program/components/forms/update/status/update-status-btn";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import UnauthorizedPageError from "@/modules/common/components/global/error/unauthorized-page-error";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { Badge } from "@ui/badge";
import { enumDisplay } from "@/modules/common/lib/enum-display";
import CopyText from "@/modules/common/components/global/copy-text";
import ViewCohortCard from "@/modules/cohort/components/cards/view-card";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";

// Force dynamic rendering since we use auth
export const dynamic = "force-dynamic";

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const readPermission = await checkPermission("Program", "read");

  if (!readPermission) {
    return <UnauthorizedPageError />;
  }

  const { id } = await params;

  const { data: program } = await getOne({ id });

  if (!program) {
    return notFound();
  }

  return (
    <div className="spacing space-y-10">
      <PageHeader program={program} />
      <section className="">
        <div className="py-5 mb-10 px-10 bg-background rounded-md border">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Loader className="size-4" strokeWidth={1.5} /> Status
              </div>
              <div>
                <Badge
                  variant={program.status === "ACTIVE" ? "success" : "outline"}
                  className="capitalize"
                >
                  {enumDisplay(program.status)}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <School className="size-4" strokeWidth={1.5} /> Academic Partner
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="size-7">
                  {program.academic_partner.logo_url && (
                    <AvatarImage
                      src={program.academic_partner.logo_url ?? ""}
                    />
                  )}
                  <AvatarFallback className="text-sm">
                    {program.academic_partner.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <p className="font-medium">{program.academic_partner.name}</p>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Layers className="size-4" strokeWidth={1.5} /> Type
              </div>
              <div>
                <Badge className="capitalize">
                  {enumDisplay(program.type)}
                </Badge>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Key className="size-4" strokeWidth={1.5} /> Program Key
              </div>
              <CopyText value={program.program_key}>
                {program.program_key}
              </CopyText>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <AlignJustify className="size-4" strokeWidth={1.5} /> Total
                Cohorts
              </div>
              <div>{program.cohorts.length}</div>
            </div>
          </div>
        </div>
        <div className="flex items-start xl:gap-15 gap-10">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <h2 className="h2">Cohorts</h2>
              {program.status === "ACTIVE" && (
                <Link
                  href={`/cohorts/new?program_id=${id}`}
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  <Plus className="size-4" /> Cohort
                </Link>
              )}
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {program.cohorts.map((cohort) => (
                  <div key={cohort.id}>
                    <ViewCohortCard cohort={cohort} />
                  </div>
                ))}
              </div>
              {program.cohorts.length === 0 && (
                <div className="w-full flex items-center justify-center min-h-50 rounded-lg bg-background border-2 border-spacing-3 border-dashed">
                  No cohorts found{" "}
                  {program.status !== "ACTIVE" &&
                    ", Please activate the program to create cohorts"}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const HeaderActions = async ({
  program,
  id,
}: {
  program: GetOne;
  id: string;
}) => {
  const updatePermission = await checkPermission("Program", "update");
  const deletePermission = await checkPermission("Program", "delete");

  return program.status !== "ACTIVE" ? (
    <>
      {updatePermission && <UpdateStatusBtn program={program} />}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={"icon"}>
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit" align="end">
          {updatePermission && (
            <DropdownMenuItem asChild>
              <Link href={`/programs/${id}/edit`}>
                <Pencil className="size-3.5" /> Edit
              </Link>
            </DropdownMenuItem>
          )}
          {deletePermission && (
            <DropdownMenuItem className="text-destructive">
              <TrashIcon className="size-3.5 text-inherit" /> Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  ) : null;
};

const PageHeader = async ({ program }: { program: GetOne }) => {
  return (
    <section>
      <div>
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div>
                <PageBreadcrumb title={program.name} />
              </div>
              <h1 className="h1 font-medium text-primary">{program.name}</h1>
            </div>
            <div className="flex items-center gap-2">
              <HeaderActions program={program} id={program.id} />
            </div>
          </div>
          <hr className="border-gray-200" />
        </div>
      </div>
    </section>
  );
};

const PageBreadcrumb = ({ title }: { title: string }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/programs">Programs</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
