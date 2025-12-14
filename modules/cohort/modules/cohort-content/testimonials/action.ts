"use server";
import { primaryDB } from "@/modules/common/database";
import { revalidatePath } from "next/cache";

export async function updateSectionVisibilityAction({
  recordId,
  isVisible,
}: {
  recordId: string;
  isVisible: boolean;
}) {
  await primaryDB.cohortTestimonialSection.update({
    where: { id: recordId },
    data: {
      is_section_visible: isVisible,
    },
  });
  revalidatePath("/cohorts");
}
