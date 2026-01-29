import {
  GetOne,
  getOneWithRelationsAction,
} from "@/modules/topic/components/forms/read/get-one-with-relations-action";
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
      title: "Topic Not Found",
      description: "The requested topic could not be found on XITE Platform",
    });
  }

  return generateSEOMetadata({
    title: data.title,
    description: `View topic details for ${data.title} on XITE Platform. ${
      data.sub_topics.length
    } subtopic(s). ${
      data.description ? data.description.substring(0, 100) + "..." : ""
    }`,
    ogTitle: data.title,
    ogDescription: data.description
      ? data.description.substring(0, 150)
      : `Topic: ${data.title} on XITE Platform`,
  });
}

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

  const { data } = await getOneWithRelationsAction(id);

  if (!data) {
    return notFound();
  }

  return (
    <div className="spacing space-y-6">
      <PageHeader data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left sidebar: topic details */}
        <aside className="lg:col-span-3 shrink-0">
          <div className="space-y-4 border rounded-lg p-4 bg-card">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Title</p>
              <p className="text-sm font-medium">{data.title}</p>
            </div>
            {data.description && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Description</p>
                <p className="text-sm">{data.description}</p>
              </div>
            )}
          </div>
        </aside>

        {/* Middle: subtopics list */}
        <main className="lg:col-span-6 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Sub Topics</h2>
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
            <RecordActivityList recordId={id} recordType="Topic" />
          </Suspense>
        </aside>
      </div>
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
