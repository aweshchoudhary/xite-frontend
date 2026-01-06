import UpdateForm from "@/modules/program/components/forms/update/form";
import { MODULE_PATH } from "@/modules/program/contants";
import { getOne } from "@/modules/program/server/read";
import { notFound } from "next/navigation";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import UnauthorizedPageError from "@/modules/common/components/global/error/unauthorized-page-error";
import { generateSEOMetadata } from "@/modules/common/lib/seo";
import type { Metadata } from "next";

interface EditPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Force dynamic rendering since we use auth
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getOne({ id });

  if (!data) {
    return generateSEOMetadata({
      title: "Edit Program",
      description: "Edit program on XITE Platform",
    });
  }

  return generateSEOMetadata({
    title: `Edit ${data.name}`,
    description: `Edit program details for ${data.name} on XITE Platform`,
  });
}
export default async function EditPage({ params }: EditPageProps) {
  const permission = await checkPermission("Program", "update");
  const { id } = await params;
  const { data } = await getOne({ id });

  if (!data) {
    return notFound();
  }

  if (!permission || data?.status === "ACTIVE") {
    return <UnauthorizedPageError />;
  }

  return (
    <article className="spacing">
      <section>
        <div>
          <h1 className="h1 mb-10">{data.name}</h1>
        </div>
        <UpdateForm
          currentData={{
            ...data,
            tags: data.tags?.map((tag) => tag.id) || [],
          }}
          successRedirectPath={`${MODULE_PATH}/${data.id}`}
          cancelRedirectPath={`${MODULE_PATH}/${data.id}`}
        />
      </section>
    </article>
  );
}
