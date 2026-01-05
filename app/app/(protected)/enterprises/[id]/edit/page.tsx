import UpdateForm from "@/modules/enterprise/components/forms/update/form";
import { MODULE_NAME, MODULE_PATH } from "@/modules/enterprise/contants";
import { getOne } from "@/modules/enterprise/server/read";
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
              address: currentData.address ?? "",
              note: currentData.note ?? "",
            }}
            successRedirectPath={`${MODULE_PATH}/${currentData.id}`}
            cancelRedirectPath={`${MODULE_PATH}/${currentData.id}`}
          />
        </div>
      </section>
    </article>
  );
}
