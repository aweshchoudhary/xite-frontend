import UpdateForm from "@/modules/topic/components/forms/subtopic/update/form";
import { MODULE_PATH } from "@/modules/topic/contants";
import { notFound } from "next/navigation";
import { getOne } from "@/modules/topic/server/read";

export default async function EditSubTopicPage({
  params,
}: {
  params: Promise<{ id: string; subtopicId: string }>;
}) {
  const { id, subtopicId } = await params;
  const { data: topic } = await getOne({ id });

  if (!topic) {
    return notFound();
  }

  const subtopic = topic.sub_topics.find((st) => st.id === subtopicId);

  if (!subtopic) {
    return notFound();
  }

  return (
    <article className="spacing">
      <section>
        <div className="mb-10">
          <h1 className="h1">Edit Sub Topic</h1>
        </div>

        <div>
          <UpdateForm
            currentData={{
              id: subtopic.id,
              title: subtopic.title,
              description: subtopic.description || null,
              keywords: subtopic.keywords || [],
              taost_id: subtopic.taost_id,
              topic_id: id,
            }}
            successRedirectPath={`${MODULE_PATH}/${id}`}
            cancelRedirectPath={`${MODULE_PATH}/${id}`}
          />
        </div>
      </section>
    </article>
  );
}
