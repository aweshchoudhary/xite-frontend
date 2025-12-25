"use server";

import { createTemplate } from "@microsite-cms/common/services/db";
import { ITemplate } from "@microsite-cms/common/services/db/types/interfaces";
import { revalidatePath } from "next/cache";

export async function createTemplateAction(data: ITemplate) {
  const template = await createTemplate(data);
  revalidatePath("/cms");
  return template;
}
