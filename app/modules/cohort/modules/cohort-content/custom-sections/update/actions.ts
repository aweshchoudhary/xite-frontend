"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { CohortSectionType } from "@/modules/common/database/prisma/generated/prisma";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { UpdateSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { getLoggedInUser } from "@/modules/user/utils";
import { uploadFile } from "@/modules/common/services/file-upload";
import { GetCohort } from "@/modules/cohort/server/cohort/read";
import { upsertSectionPosition } from "@/modules/cohort/server/cohort/update";

export type UpdateActionResponse = {
  data: PrimaryDB.CohortGenericSectionGetPayload<object>[];
};

export type UpdateActionProps = {
  data: UpdateSchema;
  currentSections: UpdateSchema["sections"];
  cohortData: GetCohort;
};
export const updateAction = async ({
  data,
  currentSections,
}: UpdateActionProps): Promise<UpdateActionResponse> => {
  try {
    const currentUser = await getLoggedInUser();
    const { sections, cohort_id } = data;

    // Upload new banner images if needed (can stay parallel)
    const modifiedSections = await Promise.all(
      sections.map(async (section) => {
        if (
          section.banner_image_file &&
          section.banner_image_action === "upload"
        ) {
          const { fileUrl } = await uploadFile(section.banner_image_file);
          return { ...section, banner_image_url: fileUrl };
        }
        return section;
      })
    );

    // Disconnect and delete old sections (keep as is)
    await Promise.all(
      currentSections.map(async (section) => {
        await primaryDB.cohort.update({
          where: { id: cohort_id },
          data: { generic_sections: { disconnect: { id: section.id } } },
        });
        await primaryDB.cohortSectionOrder.deleteMany({
          where: { section_id: section.id },
        });
      })
    );

    // Sequentially create & upsert positions to avoid race conditions
    const upsertedData: any[] = [];
    for (const {
      banner_image_file,
      banner_image_action,
      id,
      after_section_id,
      background,
      ...item
    } of modifiedSections) {
      // create the section first
      const createdSection = await primaryDB.cohortGenericSection.create({
        data: {
          ...item,
          background: background
            ? {
                create: {
                  text_color: background?.text_color ?? "",
                  background_color: background?.background_color ?? "",
                },
              }
            : undefined,
          updated_by: { connect: { id: currentUser.id } },
          cohort: { connect: { id: cohort_id } },
        },
      });

      // compute target position
      let position: number;

      if (after_section_id) {
        // find the section order record for the after_section_id (may exist already)
        const afterSection = await primaryDB.cohortSectionOrder.findFirst({
          where: { section_id: after_section_id, cohort_id },
        });
        position = afterSection ? afterSection.section_position + 1 : 0;
      } else {
        // append to end: find current max position for cohort
        const maxPosRecord = await primaryDB.cohortSectionOrder.findFirst({
          where: { cohort_id },
          orderBy: { section_position: "desc" },
        });
        position = maxPosRecord ? maxPosRecord.section_position + 1 : 0;
      }

      // call the fixed upsert function (await so next iteration sees DB changes)
      await upsertSectionPosition({
        cohort_id,
        section_type: CohortSectionType.custom_section,
        section_id: createdSection.id,
        position,
      });

      upsertedData.push(createdSection);
    }

    // Revalidate cache for cohorts page
    revalidatePath("/cohorts");

    return { data: upsertedData };
  } catch (error) {
    console.error("Error in updateAction:", error);
    throw error;
  }
};
