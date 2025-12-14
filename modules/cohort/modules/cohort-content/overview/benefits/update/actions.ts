"use server";
import { primaryDB, PrimaryDB } from "@/modules/common/database";
import { UpdateSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { uploadFile } from "@/modules/common/services/file-upload";
import { getLoggedInUser } from "@/modules/user/utils";

export type UpdateActionResponse = {
  data: PrimaryDB.CohortBenefitsSectionGetPayload<{
    include: {
      benefits_items: true;
    };
  }>;
};

export type UpdateActionProps = {
  data: UpdateSchema;
};

export const updateAction = async ({
  data,
}: UpdateActionProps): Promise<UpdateActionResponse> => {
  try {
    const { cohort_id, benefits_items, ...rest } = data;
    const currentUser = await getLoggedInUser();
    const benefitsItemsWithImageUrl = await Promise.all(
      benefits_items.map(
        async ({ icon_image_file, icon_image_file_action, ...item }) => {
          if (icon_image_file && icon_image_file_action === "upload") {
            const image_url = (await uploadFile(icon_image_file!)).fileUrl;
            return { ...item, icon_image_url: image_url };
          }
          return { ...item, icon_image_url: item.icon_image_url };
        }
      )
    );

    const upsertedData = await primaryDB.cohortBenefitsSection.create({
      data: {
        ...rest,
        cohort: {
          connect: {
            id: cohort_id,
          },
        },
        benefits_items: {
          createMany: {
            data: benefitsItemsWithImageUrl,
          },
        },
        updated_by: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: {
        benefits_items: true,
      },
    });

    revalidatePath("/cohorts");

    return { data: upsertedData };
  } catch (error) {
    throw error;
  }
};
