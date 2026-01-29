import UpdateForm from "@/modules/user/components/forms/update/form";
import { MODULE_NAME, MODULE_PATH } from "@/modules/user/contants";
import { getOneUser } from "@/modules/user/components/forms/read/action";
import { notFound } from "next/navigation";
import { generateSEOMetadata } from "@/modules/common/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getOneUser(id);

  if (!data) {
    return generateSEOMetadata({
      title: "Edit User",
      description: "Edit user on XITE Platform",
    });
  }

  return generateSEOMetadata({
    title: `Edit ${data.name || data.email}`,
    description: `Edit user details for ${data.name || data.email} on XITE Platform`,
  });
}

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: currentData } = await getOneUser(id);

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
            defaultValues={{
              id: currentData.id,
              name: currentData.name || "",
              email: currentData.email || "",
              username: currentData.username || "",
              roles: currentData.roles.map((role) => role.role),
              isActive: currentData.isActive,
            }}
            successRedirectPath={`${MODULE_PATH}/${currentData.id}`}
            cancelRedirectPath={`${MODULE_PATH}/${currentData.id}`}
          />
        </div>
      </section>
    </article>
  );
}
