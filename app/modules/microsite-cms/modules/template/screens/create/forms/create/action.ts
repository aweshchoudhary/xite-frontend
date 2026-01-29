"use server";

import { createTemplate } from "@/modules/common/database/mongodb";
import { ITemplate } from "@/modules/common/database/mongodb/types/interfaces";
import { revalidatePath } from "next/cache";

export async function createTemplateAction(data: ITemplate) {
  const template = await createTemplate(data);
  revalidatePath("/cms");
  return template;
}
