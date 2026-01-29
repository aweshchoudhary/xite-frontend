"use server";
import { getTemplateById } from "@/modules/common/database/mongodb/actions/template/read";
import UpdateForm from "./forms/update/form";
import { notFound } from "next/navigation";

export default async function Update({ id }: { id: string }) {
  const template = await getTemplateById(id);
  if (!template) {
    return notFound();
  }
  return (
    <div>
      <UpdateForm template={template} />
    </div>
  );
}
