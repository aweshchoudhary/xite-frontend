import {
  getOne,
  GetOneOutput as GetOne,
} from "@/modules/enterprise/server/read";
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

// Force dynamic rendering since we use auth
export const dynamic = "force-dynamic";
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

  const data = await getOne({ id });

  if (!data) {
    return notFound();
  }

  return (
    <div className="spacing space-y-10">
      <PageHeader data={data} />
      <section>
        <div className="flex xl:gap-15 items-start gap-10">
          <div className="p-5 bg-background rounded-md border w-[35%]">
            <p className="text-sm text-muted-foreground mb-5">
              Enterprise Details
            </p>
            <div className="space-y-5">
              <div className="grid grid-cols-2 text-left gap-2">
                <div className="flex items-center gap-2">Address</div>
                <div
                  className="prose prose-sm"
                  dangerouslySetInnerHTML={{
                    __html: data.address || "Not Set",
                  }}
                ></div>
              </div>
              <div className="grid grid-cols-2 text-left gap-2">
                <div className="flex items-center gap-2">Note</div>
                <div
                  className="prose prose-sm"
                  dangerouslySetInnerHTML={{ __html: data.note || "Not Set" }}
                ></div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <h2 className="h3">Programs</h2>
            </div>
            <div className="space-y-3">
              {data.programs.map((program) => (
                <div key={program.id}>
                  <ViewCard program={program} />
                </div>
              ))}
              {data.programs.length === 0 && (
                <div className="w-full flex items-center justify-center min-h-50 rounded-lg bg-background border-2 border-spacing-3 border-dashed">
                  No programs found
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
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
