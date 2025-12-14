"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { UpdateSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { getLoggedInUser } from "@/modules/user/utils";

export type UpdateActionResponse = {
  data: PrimaryDB.CohortBrandingGetPayload<{
    include: {
      background_color: true;
      primary_color: true;
      secondary_color: true;
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
    const { cohort_id, ...rest } = data;
    const currentUser = await getLoggedInUser();

    const upsertedData = await primaryDB.cohortBranding.create({
      data: {
        cohort: {
          connect: {
            id: cohort_id,
          },
        },
        background_color: {
          create: {
            text_color: rest.background_color.text_color,
            background_color: rest.background_color.background_color,
          },
        },
        default_border_radius: rest.default_border_radius ?? 0,
        font_name: rest.font_name,
        primary_color: {
          create: {
            text_color: rest.primary_color.text_color,
            background_color: rest.primary_color.background_color,
          },
        },
        secondary_color: {
          create: {
            text_color: rest.secondary_color.text_color,
            background_color: rest.secondary_color.background_color,
          },
        },
        updated_by: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: {
        background_color: true,
        primary_color: true,
        secondary_color: true,
      },
    });

    revalidatePath("/cohorts");

    return { data: upsertedData };
  } catch (error) {
    throw error;
  }
};
