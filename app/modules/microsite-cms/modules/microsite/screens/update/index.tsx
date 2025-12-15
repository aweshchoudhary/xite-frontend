"use server";
import { getMicrositeById } from "@/modules/common/services/db/actions/microsite/read";
import { getTemplateById } from "@/modules/common/services/db/actions/template/read";
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
