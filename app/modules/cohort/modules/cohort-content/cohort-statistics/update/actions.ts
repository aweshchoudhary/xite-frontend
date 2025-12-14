"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { UpdateSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { uploadFile } from "@/modules/common/services/file-upload";
import { getLoggedInUser } from "@/modules/user/utils";

export type UpdateActionResponse = {
  data: PrimaryDB.CohortStatisticsSectionGetPayload<object>;
};

export type UpdateActionProps = {
  data: UpdateSchema;
};

export const updateAction = async ({
  data,
}: UpdateActionProps): Promise<UpdateActionResponse> => {
  try {
    const {
      id,
      cohort_id,
      work_experience_item,
      industry_item,
      designation_item,
      company_item,
      ...rest
    } = data;
    const currentUser = await getLoggedInUser();
    const { chart_image_file } = work_experience_item;
    const { image_file } = company_item;

    let chart_image_url = work_experience_item.chart_image_url;
    if (chart_image_file) {
      chart_image_url = (await uploadFile(chart_image_file)).fileUrl;
    }

    let image_url = company_item.image_url;
    if (image_file) {
      image_url = (await uploadFile(image_file)).fileUrl;
    }

    const upsertedData = await primaryDB.cohortStatisticsSection.create({
      data: {
        ...rest,
        cohort: {
          connect: {
            id: cohort_id,
          },
        },
        work_experience_item: {
          create: {
            title: work_experience_item.title,
            description: work_experience_item.description,
            chart_image_url,
          },
        },
        industry_item: {
          create: {
            title: industry_item.title,
            description: industry_item.description,
            data_list: {
              create: {
                title: industry_item.data_list.title ?? "",
                items: {
                  create: industry_item.data_list.items?.map((item) => ({
                    title: item.title ?? "",
                    description: item.description ?? "",
                  })),
                },
              },
            },
          },
        },
        designation_item: {
          create: {
            ...designation_item,
            data_list: {
              create: {
                title: designation_item.data_list.title ?? "",
                description: designation_item.data_list.description ?? "",
                items: {
                  create: designation_item.data_list.items?.map((item) => ({
                    title: item.title ?? "",
                    description: item.description ?? "",
                  })),
                },
              },
            },
          },
        },
        company_item: {
          create: {
            title: company_item.title,
            top_description: company_item.top_description,
            bottom_description: company_item.bottom_description,
            image_url,
          },
        },
        updated_by: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    revalidatePath("/cohorts");

    return { data: upsertedData };
  } catch (error) {
    throw error;
  }
};
