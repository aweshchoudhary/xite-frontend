import UpdateForm from "@/modules/faculty/components/forms/update/form";
import { MODULE_NAME, MODULE_PATH } from "@/modules/faculty/contants";
import { getOne } from "@/modules/faculty/server/read";
import { notFound } from "next/navigation";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentData = await getOne({ id });

  if (!currentData) {
    notFound();
  }

  return (
    <article className="spacing">
      <section>
        <div className="mb-10">
          <h1 className="h1">Edit {MODULE_NAME}</h1>
        </div>

        <div>
          <UpdateForm
            currentData={{
              ...currentData,
              academic_partner_id: currentData.academic_partner_id ?? "",
              profile_image_file_action: "upload",
              faculty_subject_areas: currentData.faculty_subject_areas.map(
                (subjectArea) => subjectArea.id
              ),
              subtopics:
                currentData.subtopics && currentData.subtopics.length > 0
                  ? currentData.subtopics.map((subtopic) => ({
                      topic_id: subtopic.topic?.id ?? subtopic.topic_id ?? null,
                      sub_topic_id: subtopic.id ?? null,
                    }))
                  : [{ topic_id: null, sub_topic_id: null }],
            }}
            successRedirectPath={`${MODULE_PATH}/${currentData.id}`}
            cancelRedirectPath={`${MODULE_PATH}/${currentData.id}`}
          />
        </div>
      </section>
    </article>
  );
}
