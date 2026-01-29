"use server";
import { getMicrositeById } from "@/modules/common/database/mongodb/actions/microsite/read";
import { getTemplateById } from "@/modules/common/database/mongodb/actions/template/read";
import UpdateForm from "./form";
import { notFound } from "next/navigation";

export default async function UpdatePage({ id }: { id: string }) {
  const microsite = await getMicrositeById(id);
  if (!microsite) {
    return notFound();
  }

  const template = await getTemplateById(microsite.templateId);
  if (!template) {
    return notFound();
  }

  return <UpdateForm microsite={microsite} template={template} />;
}
