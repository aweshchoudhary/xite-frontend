"use server";
import { updateTemplate } from "@/modules/microsite-cms/modules/common/services/db";
import { ITemplate } from "@/modules/microsite-cms/modules/common/services/db/types/interfaces";
import { revalidatePath } from "next/cache";

export async function updateTemplateAction(
  id: string,
  data: Partial<ITemplate>
): Promise<ITemplate> {
  try {
    const updated = await updateTemplate(id, data);

    revalidatePath(`/templates/${id}`);

    return updated;
  } catch (error) {
    throw error;
  }
}
