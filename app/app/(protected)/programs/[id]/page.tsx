import {
  GetOne,
  getOneWithRelationsAction,
} from "@/modules/program/components/forms/read/get-one-with-relations-action";
import { Button, buttonVariants } from "@ui/button";
import {
  AlignJustify,
  ChevronDownIcon,
  Key,
  Layers,
  Pencil,
  Plus,
  Tag,
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
import { generateSEOMetadata } from "@/modules/common/lib/seo";
import type { Metadata } from "next";
import { isUserAdmin } from "@/modules/user/utils";
import ProgramActivityList from "@/modules/program/components/program-activity-list";
import { Suspense } from "react";

// Force dynamic rendering since we use auth
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { data: program } = await getOneWithRelationsAction(id);

  if (!program) {
    return generateSEOMetadata({
      title: "Program Not Found",
      description: "The requested program could not be found on XITE Platform",
    });
  }

  return generateSEOMetadata({
    title: program.name,
    description: `View program details for ${program.name} on XITE Platform. Academic Partner: ${program.academic_partner.name}. ${program.cohorts.length} cohort(s).`,
    ogTitle: program.name,
    ogDescription: `${program.name} program by ${program.academic_partner.name} on XITE Platform`,
  });
}

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

  const { data: program } = await getOneWithRelationsAction(id);

  if (!program) {
    return notFound();
  }

  return (
    <div className="spacing space-y-6">
      <PageHeader program={program} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left sidebar: program details (no academic partner) */}
        <aside className="lg:col-span-3 shrink-0">
          <div className="space-y-4 border rounded-lg p-4 bg-card">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Layers className="size-3.5" /> Type
              </p>
              <Badge className="capitalize text-xs">{enumDisplay(program.type)}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Key className="size-3.5" /> Program Key
              </p>
              <CopyText value={program.program_key}>
                <span className="text-sm font-mono truncate block">
                  {program.program_key}
                </span>
              </CopyText>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <AlignJustify className="size-3.5" /> Total Cohorts
              </p>
              <span className="text-sm">{program.cohorts.length}</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Tag className="size-3.5" /> Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {program.tags?.length ? (
                  program.tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary" className="text-xs">
                      {tag.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground text-xs">No tags</span>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Middle: cohort list (wider) */}
        <main className="lg:col-span-6 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Cohorts</h2>
            {program.status === "ACTIVE" && (
              <Link
                href={`/cohorts/new?program_id=${id}`}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                <Plus className="size-4" /> Cohort
              </Link>
            )}
          </div>
          {program.cohorts.length > 0 ? (
            <div>
              {program.cohorts.map((cohort) => (
                <ViewCohortCard key={cohort.id} cohort={cohort} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed bg-muted/30 py-12 text-center text-sm text-muted-foreground">
              No cohorts found
              {program.status !== "ACTIVE" &&
                " — activate the program to create cohorts"}
            </div>
          )}
        </main>

        {/* Right: program activity (plain list) */}
        <aside className="lg:col-span-3 shrink-0">
          <Suspense
            fallback={
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Activity</h3>
                <p className="text-xs text-muted-foreground">Loading…</p>
              </div>
            }
          >
            <ProgramActivityList programId={id} />
          </Suspense>
        </aside>
      </div>
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
  const admin = await isUserAdmin();

  if (program.status === "ACTIVE" && !admin) {
    return null;
  }

  return (
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
  );
};

const PageHeader = async ({ program }: { program: GetOne }) => {
  const partner = program.academic_partner;
  const partnerHref = partner?.id ? `/academic-partners/${partner.id}` : null;

  return (
    <section>
      <PageBreadcrumb title={program.name} />
      <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-4 min-w-0">
          <div>
            <h1 className="text-2xl font-semibold text-primary truncate">
              {program.name}
            </h1>
            {partner && (
              <Link
                href={partnerHref ?? "#"}
                className={cn(
                  "inline-flex items-center gap-2 mt-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors",
                  !partnerHref && "pointer-events-none"
                )}
              >
                <Avatar className="size-5">
                  {partner.logo_url && (
                    <AvatarImage src={partner.logo_url} alt={partner.name} />
                  )}
                  <AvatarFallback className="text-xs bg-muted">
                    {partner.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{partner.name}</span>
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge
            variant={program.status === "ACTIVE" ? "success" : "outline"}
            className="capitalize"
          >
            {enumDisplay(program.status)}
          </Badge>
          <HeaderActions program={program} id={program.id} />
        </div>
      </div>
      <div className="border-t mt-6" />
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
