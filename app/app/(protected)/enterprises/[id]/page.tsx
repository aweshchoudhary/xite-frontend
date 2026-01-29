import {
  GetOne,
  getOneWithRelationsAction,
} from "@/modules/enterprise/components/forms/read/get-one-with-relations-action";
import { Button } from "@ui/button";
import { ChevronDownIcon, Pencil, TrashIcon } from "lucide-react";
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
import ViewCard from "@/modules/program/components/view/view-card";
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
      title: "Enterprise Not Found",
      description:
        "The requested enterprise could not be found on XITE Platform",
    });
  }

  return generateSEOMetadata({
    title: data.name,
    description: `View enterprise details for ${data.name} on XITE Platform. ${data.programs.length} program(s) associated.`,
    ogTitle: data.name,
    ogDescription: `Enterprise partner ${data.name} on XITE Platform`,
  });
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const readPermission = await checkPermission("Enterprise", "read");

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
        {/* Left sidebar: enterprise details */}
        <aside className="lg:col-span-3 shrink-0">
          <div className="space-y-4 border rounded-lg p-4 bg-card">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Address</p>
              <div
                className="text-sm prose prose-sm"
                dangerouslySetInnerHTML={{
                  __html: data.address || "Not Set",
                }}
              ></div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Note</p>
              <div
                className="text-sm prose prose-sm"
                dangerouslySetInnerHTML={{ __html: data.note || "Not Set" }}
              ></div>
            </div>
          </div>
        </aside>

        {/* Middle: programs list */}
        <main className="lg:col-span-6 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Programs</h2>
          </div>
          {data.programs.length > 0 ? (
            <div className="space-y-3">
              {data.programs.map((program) => (
                <div key={program.id}>
                  <ViewCard program={program} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed bg-muted/30 py-12 text-center text-sm text-muted-foreground">
              No programs found
            </div>
          )}
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
            <RecordActivityList recordId={id} recordType="Enterprise" />
          </Suspense>
        </aside>
      </div>
    </div>
  );
}

const HeaderActions = async ({ id }: { data: GetOne; id: string }) => {
  const updatePermission = await checkPermission("Enterprise", "update");
  const deletePermission = await checkPermission("Enterprise", "delete");

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
              <Link href={`/enterprises/${id}/edit`}>
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
          <BreadcrumbLink href="/enterprises">Enterprises</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
