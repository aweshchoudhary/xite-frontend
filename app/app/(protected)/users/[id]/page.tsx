import { getOneUser } from "@/modules/user/components/forms/read/action";
import { Button } from "@ui/button";
import {
  ChevronDownIcon,
  Mail,
  Pencil,
  TrashIcon,
  User as UserIcon,
  CheckCircle2,
  XCircle,
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
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { generateSEOMetadata } from "@/modules/common/lib/seo";
import type { Metadata } from "next";

// Force dynamic rendering since we use auth
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getOneUser(id);

  if (!data) {
    return generateSEOMetadata({
      title: "User Not Found",
      description:
        "The requested user could not be found on XITE Platform",
    });
  }

  return generateSEOMetadata({
    title: data.name || data.email || "User",
    description: `View user details for ${data.name || data.email} on XITE Platform.`,
    ogTitle: data.name || data.email || "User",
    ogDescription: `User ${data.name || data.email} on XITE Platform`,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const readPermission = await checkPermission("User", "read");

  if (!readPermission) {
    return <UnauthorizedPageError />;
  }

  const { id } = await params;
  const { data } = await getOneUser(id);

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
              User Details
            </p>
            <div className="space-y-5">
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
                  <UserIcon className="size-4" strokeWidth={1.5} /> Username
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{data.username || "—"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 text-left gap-2">
                <div className="flex items-center gap-2">
                  Status
                </div>
                <div className="flex items-center gap-2">
                  {data.isActive ? (
                    <>
                      <CheckCircle2 className="size-4 text-green-600" />
                      <span className="text-green-600 font-medium">Active</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="size-4 text-red-600" />
                      <span className="text-red-600 font-medium">Inactive</span>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 text-left gap-2">
                <div className="flex items-center gap-2">
                  Created At
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    {new Date(data.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 space-y-6">
            <div className="bg-background p-5 border rounded-md">
              <h2 className="text-lg font-medium mb-4">Roles & Permissions</h2>
              {data.roles && data.roles.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {data.roles.map((role) => (
                    <Badge key={role.id} variant="secondary" className="text-base px-4 py-2">
                      {role.role}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No roles assigned yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const HeaderActions = async ({
  id,
}: {
  id: string;
}) => {
  const updatePermission = await checkPermission("User", "update");
  const deletePermission = await checkPermission("User", "delete");

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
              <Link href={`/users/${id}/edit`}>
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

const PageHeader = async ({
  data,
}: {
  data: Awaited<ReturnType<typeof getOneUser>>["data"];
}) => {
  if (!data) return null;

  return (
    <section>
      <div>
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div>
                <PageBreadcrumb title={data.name || data.email || "User"} />
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="size-14">
                  {data.image && <AvatarImage src={data.image} />}
                  <AvatarFallback className="text-sm uppercase">
                    {(data.name || data.email || "U").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <h1 className="h1 font-medium text-primary">
                  {data.name || data.email}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <HeaderActions id={data.id} />
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
          <BreadcrumbLink href="/users">Users</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
