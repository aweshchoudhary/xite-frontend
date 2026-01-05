import UpdateForm from "@/modules/topic/components/forms/update/form";
import { MODULE_NAME, MODULE_PATH } from "@/modules/topic/contants";
import { getOne } from "@/modules/topic/server/read";
import { notFound } from "next/navigation";
import { generateSEOMetadata } from "@/modules/common/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getOne({ id });

  if (!data) {
    return generateSEOMetadata({
      title: "Edit Topic",
      description: "Edit topic on Xite Platform",
    });
  }

  return generateSEOMetadata({
    title: `Edit ${data.title}`,
    description: `Edit topic details for ${data.title} on Xite Platform`,
  });
}

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data } = await getOne({ id });

  if (!data) {
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
            currentData={data}
            successRedirectPath={`${MODULE_PATH}/${data.id}`}
            cancelRedirectPath={`${MODULE_PATH}/${data.id}`}
          />
        </div>
      </section>
    </article>
  );
}

