"use server";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { getLoggedInUser } from "@/modules/user/utils";
import { revalidatePath } from "next/cache";

export async function updateSectionVisibilityAction({
  recordId,
  isVisible,
}: {
  recordId: string;
  isVisible: boolean;
}) {
  const currentUser = await getLoggedInUser();
  await primaryDB.cohortStatisticsSection.update({
    where: { id: recordId },
    data: {
      is_section_visible: isVisible,
      updated_by: {
        connect: {
          id: currentUser.id,
        },
      },
    },
  });
  revalidatePath("/cohorts");
}
