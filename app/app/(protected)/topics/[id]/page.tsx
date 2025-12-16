import { GetOne, getOne } from "@/modules/topic/server/read";
import { Button } from "@ui/button";
import { Plus } from "lucide-react";
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
import SubTopicsList from "./components/subtopics-list";
import HeaderActions from "./components/header-actions";

// Force dynamic rendering since we use auth
export const dynamic = "force-dynamic";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const readPermission = await checkPermission("Topic", "read");

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
              Topic Details
            </p>
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Title</p>
                  <p className="font-medium">{data.title}</p>
                </div>
                {data.description && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Description
                    </p>
                    <p className="text-sm">{data.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <h2 className="h3">Sub Topics</h2>
              <Link
                href={`/topics/${id}/subtopics/new`}
                className="inline-flex items-center gap-2"
              >
                <Button size="sm">
                  <Plus className="size-4" />
                  Sub Topic
                </Button>
              </Link>
            </div>
            <SubTopicsList topicId={id} subtopics={data.sub_topics} />
          </div>
        </div>
      </section>
    </div>
  );
}

const PageHeader = async ({ data }: { data: GetOne }) => {
  return (
    <section>
      <div>
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div>
                <PageBreadcrumb title={data.title} />
              </div>
              <h1 className="h1 font-medium text-primary">{data.title}</h1>
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
          <BreadcrumbLink href="/topics">Topics</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

