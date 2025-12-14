"use server";
import { primaryDB, PrimaryDB } from "@/modules/common/database";
import { UpdateSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { uploadFile } from "@/modules/common/services/file-upload";
import { getLoggedInUser } from "@/modules/user/utils";

export type UpdateActionResponse = {
  data: PrimaryDB.CohortMediaSectionGetPayload<object>;
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
      university_logo_file,
      university_logo_file_action,
      ...rest
    } = data;
    const currentUser = await getLoggedInUser();
    if (university_logo_file && university_logo_file_action === "upload") {
      const image_url = (await uploadFile(university_logo_file)).fileUrl;
      rest.university_logo_url = image_url;
    }

    const upsertedData = await primaryDB.cohortMediaSection.update({
      where: {
        id,
      },
      data: {
        title: "University Logo",
        ...rest,
        cohort: {
          connect: {
            id: cohort_id,
          },
        },
        updated_by: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    revalidatePath("/cohort-content");

    return { data: upsertedData };
  } catch (error) {
    throw error;
  }
};
