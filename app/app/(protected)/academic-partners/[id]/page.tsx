import {
  GetOne,
  getOneWithRelationsAction,
} from "@/modules/academic-partner/components/forms/read/get-one-with-relations-action";
import { Button } from "@ui/button";
import { ChevronDownIcon, MapPin, Pencil, TrashIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
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
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import ViewCard from "@/modules/program/components/view/view-card";
import { getImageUrl } from "@/modules/common/lib/utils";
import { generateSEOMetadata } from "@/modules/common/lib/seo";
import type { Metadata } from "next";
import RecordActivityList from "@/modules/common/components/activity/record-activity-list";
import { Suspense } from "react";

// Force dynamic rendering since we use auth
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getOneWithRelationsAction(id);

  if (!data) {
    return generateSEOMetadata({
      title: "Academic Partner Not Found",
      description:
        "The requested academic partner could not be found on XITE Platform",
    });
  }

  return generateSEOMetadata({
    title: data.name,
    description: `View academic partner details for ${data.name} on XITE Platform. ${data.programs.length} program(s), ${data.faculties.length} faculty member(s).`,
    ogTitle: data.name,
    ogDescription: `Academic partner ${data.name} on XITE Platform`,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const readPermission = await checkPermission("Program", "read");

  if (!readPermission) {
    return <UnauthorizedPageError />;
  }

  const { id } = await params;

  const { data } = await getOneWithRelationsAction(id);

  if (!data) {
    return notFound();
  }

  return (
    <div className="spacing space-y-6">
      <PageHeader data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left sidebar: academic partner details */}
        <aside className="lg:col-span-3 shrink-0">
          <div className="space-y-4 border rounded-lg p-4 bg-card">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <MapPin className="size-3.5" /> Address
              </p>
              <span className="text-sm">{data.address || "—"}</span>
            </div>
          </div>
        </aside>

        {/* Middle: programs and faculty */}
        <main className="lg:col-span-6 min-w-0">
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Programs</h2>
              </div>
              {data.programs.length > 0 ? (
                <div className="space-y-3">
                  {data.programs.map((program) => (
                    <div key={program.id}>
                      <ViewCard
                        program={{
                          ...program,
                          academic_partner: { name: data.name },
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed bg-muted/30 py-12 text-center text-sm text-muted-foreground">
                  No programs found
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Faculty</h2>
              </div>
              {data.faculties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.faculties.map((faculty) => (
                    <Link
                      key={faculty.id}
                      href={`/faculty/${faculty.id}`}
                      className="p-5 flex items-center gap-3 border rounded-lg bg-background hover:bg-muted/50 transition-colors"
                    >
                      <Avatar className="size-12">
                        {faculty.profile_image && (
                          <AvatarImage src={getImageUrl(faculty.profile_image)} />
                        )}
                        <AvatarFallback className="text-sm">
                          {faculty.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-medium mb-0">{faculty.name}</h2>
                        <p className="text-sm text-muted-foreground">
                          {faculty.title}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed bg-muted/30 py-12 text-center text-sm text-muted-foreground">
                  No faculties found
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right: activity history */}
        <aside className="lg:col-span-3 shrink-0">
          <Suspense
            fallback={
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Activity</h3>
                <p className="text-xs text-muted-foreground">Loading…</p>
              </div>
            }
          >
            <RecordActivityList recordId={id} recordType="AcademicPartner" />
          </Suspense>
        </aside>
      </div>
    </div>
  );
}

const HeaderActions = async ({ id }: { data: GetOne; id: string }) => {
  const updatePermission = await checkPermission("Program", "update");
  const deletePermission = await checkPermission("Program", "delete");

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={"icon"}>
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit" align="end">
          {updatePermission && (
            <DropdownMenuItem asChild>
              <Link href={`/academic-partners/${id}/edit`}>
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

const PageHeader = async ({ data }: { data: GetOne }) => {
  return (
    <section>
      <div>
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div>
                <PageBreadcrumb title={data.name} />
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="size-14">
                  {data.logo_url && (
                    <AvatarImage src={getImageUrl(data.logo_url)} />
                  )}
                  <AvatarFallback className="text-lg font-medium">
                    {data.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h1 className="h1 font-medium text-primary">{data.name}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <HeaderActions data={data} id={data.id} />
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
          <BreadcrumbLink href="/academic-partners">
            Academic Partners
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
