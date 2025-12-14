"use server";
import { primaryDB, PrimaryDB } from "@/modules/common/database";
import { UpdateSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { uploadFile } from "@/modules/common/services/file-upload";
import { getLoggedInUser } from "@/modules/user/utils";

export type UpdateActionResponse = {
  data: PrimaryDB.CohortTestimonialSectionGetPayload<{
    include: {
      items: true;
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
    const { cohort_id, items, description, ...rest } = data;
    const currentUser = await getLoggedInUser();
    const newItems = await Promise.all(
      items.map(async ({ description, ...item }) => {
        if (item.action === "upload" && item.user_image_file) {
          const image_url = (await uploadFile(item.user_image_file)).fileUrl;
          return {
            ...item,
            user_image_url: image_url,
          };
        }
        return item;
      })
    );

    const upsertedData = await primaryDB.cohortTestimonialSection.create({
      data: {
        ...rest,
        cohort: {
          connect: {
            id: cohort_id,
          },
        },
        items: {
          createMany: {
            data: newItems.map(({ action, user_image_file, ...rest }) => ({
              ...rest,
            })),
          },
        },
        updated_by: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: {
        items: true,
      },
    });

    revalidatePath("/cohorts");

    return { data: upsertedData };
  } catch (error) {
    throw error;
  }
};
