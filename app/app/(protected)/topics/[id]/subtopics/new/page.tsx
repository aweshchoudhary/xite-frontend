import CreateForm from "@/modules/topic/components/forms/subtopic/create/form";
import { MODULE_PATH } from "@/modules/topic/contants";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import UnauthorizedPageError from "@/modules/common/components/global/error/unauthorized-page-error";
import { notFound } from "next/navigation";
import { getOneAction } from "@/modules/topic/components/forms/read/action";
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
  const { data: topic } = await getOneAction(id);

  if (!topic) {
    return generateSEOMetadata({
      title: "New Sub Topic",
      description: "Create a new subtopic on XITE Platform",
    });
  }

  return generateSEOMetadata({
    title: `New Sub Topic - ${topic.title}`,
    description: `Create a new subtopic for ${topic.title} on XITE Platform`,
  });
}

export default async function NewSubTopicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const permission = await checkPermission("Topic", "write");

  if (!permission) {
    return <UnauthorizedPageError />;
  }

  const { id } = await params;
  const { data: topic } = await getOneAction(id);

  if (!topic) {
    return notFound();
  }

  return (
    <div className="spacing">
      <section>
        <div className="mb-10">
          <h1 className="h1">New Sub Topic</h1>
        </div>
      </section>
      <section>
        <div>
          <CreateForm
            defaultValues={{
              topic_id: id,
              keywords: [],
            }}
            cancelRedirectPath={`${MODULE_PATH}/${id}`}
            successRedirectPath={`${MODULE_PATH}/${id}`}
          />
        </div>
      </section>
    </div>
  );
}
