import { getOne, GetOneOutput as GetOne } from "@/modules/faculty/server/read";
import { Button } from "@ui/button";
import {
  ChevronDownIcon,
  Layers,
  Mail,
  Pencil,
  Phone,
  School,
  TrashIcon,
} from "lucide-react";
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
import { Badge } from "@ui/badge";
import { enumDisplay } from "@/modules/common/lib/enum-display";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { getImageUrl } from "@/modules/common/lib/utils";

// Force dynamic rendering since we use auth
export const dynamic = "force-dynamic";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const readPermission = await checkPermission("Faculty", "read");

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
        <div className="flex items-start xl:gap-15 gap-10">
          <div className="p-5 bg-background rounded-md border w-[35%]">
            <p className="text-sm text-muted-foreground mb-5">
              Faculty Details
            </p>
            <div className="space-y-5">
              <div className="grid grid-cols-2 text-left gap-2">
                <div className="flex items-center gap-2">
                  <School className="size-4" strokeWidth={1.5} /> Academic
                  Partner
                </div>
                <Link
                  href={`/academic-partners/${data.academic_partner?.id}`}
                  className="flex items-center gap-2"
                >
                  <Avatar className="size-7">
                    {data.academic_partner?.logo_url && (
                      <AvatarImage
                        src={getImageUrl(data.academic_partner?.logo_url)}
                      />
                    )}
                    <AvatarFallback className="text-sm">
                      {data.academic_partner?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-medium">{data.academic_partner?.name}</p>
                </Link>
              </div>

              <div className="grid grid-cols-2 text-left gap-2">
                <div className="flex items-center gap-2">
                  <Layers className="size-4" strokeWidth={1.5} /> Type
                </div>
                <div>
                  <Badge className="capitalize">
                    {enumDisplay(data.faculty_type ?? "")}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 text-left gap-2">
                <div className="flex items-center gap-2">
                  <Mail className="size-4" strokeWidth={1.5} /> Email
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{data.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 text-left gap-2">
                <div className="flex items-center gap-2">
                  <Phone className="size-4" strokeWidth={1.5} /> Phone
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{data.phone}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-6">
            <div className="bg-background p-5 border rounded-md">
              <h2 className="text-lg font-medium">Subject Areas</h2>
              <ul className="list-disc pl-6 mt-2">
                {data.faculty_subject_areas.map((subjectArea) => (
                  <li key={subjectArea.id}>
                    {subjectArea.subject_area.name} - {subjectArea.name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-background p-5 border rounded-md">
              <h2 className="text-lg font-medium">Title: {data.title}</h2>
              <div
                dangerouslySetInnerHTML={{ __html: data?.description || "" }}
              ></div>
            </div>

            {/* <div className="flex items-center justify-between mb-3">
              <h2 className="h3">Cohorts</h2>
            </div>
            <div className="space-y-3">
              {data.cohorts.map((cohort) => (
                <div key={cohort.id}>
                  <ViewCohortCard cohort={cohort} />
                </div>
              ))}
              {data.cohorts.length === 0 && (
                <div className="w-full flex items-center justify-center min-h-50 rounded-lg bg-background border-2 border-spacing-3 border-dashed">
                  No cohorts found
                </div>
              )}
            </div> */}
          </div>
        </div>
      </section>
    </div>
  );
}

const HeaderActions = async ({ id }: { data: GetOne; id: string }) => {
  const updatePermission = await checkPermission("Faculty", "update");
  const deletePermission = await checkPermission("Faculty", "delete");

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
              <Link href={`/faculty/${id}/edit`}>
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
              <div className="flex items-center gap-2">
                <Avatar className="size-14">
                  {data.profile_image && (
                    <AvatarImage src={getImageUrl(data.profile_image)} />
                  )}
                  <AvatarFallback className="text-sm">
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
          <BreadcrumbLink href="/faculty">Faculty</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
