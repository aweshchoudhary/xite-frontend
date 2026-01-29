"use server";
import { updateTemplate } from "@/modules/common/database/mongodb";
import { ITemplate } from "@/modules/common/database/mongodb/types/interfaces";
import { revalidatePath } from "next/cache";

export async function updateTemplateAction(
  id: string,
  data: Partial<ITemplate>,
): Promise<ITemplate> {
  try {
    const updated = await updateTemplate(id, data);

    revalidatePath(`/templates/${id}`);

    return updated;
  } catch (error) {
    throw error;
  }
}
