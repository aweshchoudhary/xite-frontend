import CreateForm from "@/modules/topic/components/forms/subtopic/create/form";
import { MODULE_PATH } from "@/modules/topic/contants";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import UnauthorizedPageError from "@/modules/common/components/global/error/unauthorized-page-error";
import { notFound } from "next/navigation";
import { getOne } from "@/modules/topic/server/read";

// Force dynamic rendering since we use auth
export const dynamic = "force-dynamic";

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
  const { data: topic } = await getOne({ id });

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

