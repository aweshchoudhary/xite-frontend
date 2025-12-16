import { GetOne, getOne } from "@/modules/academic-partner/server/read";
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

// Force dynamic rendering since we use auth
export const dynamic = "force-dynamic";

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

  const { data } = await getOne({ id });

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
              Academic Partner Details
            </p>
            <div className="space-y-5">
              <div className="grid grid-cols-2 text-left gap-2">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4" strokeWidth={1.5} /> Address
                </div>
                <div>{data.address}</div>
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
                <div className="w-full rounded-lg flex items-center justify-center h-50 bg-background border-2 border-spacing-3 border-dashed">
                  No programs found
                </div>
              )}
            </div>
            <br />
            <div className="flex items-center justify-between mb-3">
              <h2 className="h3">Faculty</h2>
            </div>
            <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.faculties.map((faculty) => (
                <Link
                  key={faculty.id}
                  href={`/faculty/${faculty.id}`}
                  className="p-5 flex items-center gap-3 border rounded-lg bg-background"
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
              {data.faculties.length === 0 && (
                <div className="w-full rounded-lg flex items-center justify-center h-50 bg-background border-2 border-spacing-3 border-dashed">
                  No faculties found
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
