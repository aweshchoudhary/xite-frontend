"use server";
import { createOne, CreateOneOutput } from "@/modules/faculty/server/create";
import { CreateSchema } from "../schema";
import { revalidatePath } from "next/cache";
import { MODULE_NAME, MODULE_PATH } from "@/modules/faculty/contants";
import { uploadFile } from "@/modules/common/services/file-upload";

type CreateActionOutput = {
  error?: string;
  data?: CreateOneOutput;
};

export async function createAction(
  data: CreateSchema
): Promise<CreateActionOutput> {
  try {
    const {
      profile_image_file,
      academic_partner_id,
      faculty_code_id,
      subtopics,
      ...rest
    } = data;
    let profile_image = null;

    if (profile_image_file) {
      profile_image = (await uploadFile(profile_image_file)).fileUrl;
    }

    // Extract valid subtopic IDs (filter out nulls)
    const validSubtopicIds =
      subtopics
        ?.filter((st) => st.sub_topic_id)
        .map((st) => st.sub_topic_id) ?? [];

    const createdData = await createOne({
      ...rest,
      profile_image,
      academic_partner: {
        connect: {
          id: academic_partner_id,
        },
      },
      faculty_code: {
        connect: {
          id: faculty_code_id ?? undefined,
        },
      },
      subtopics: {
        connect: validSubtopicIds.map((id) => ({
          id: id!,
        })),
      },
    });

    if (!createdData) {
      throw new Error(`Failed to create ${MODULE_NAME}`);
    }

    revalidatePath(MODULE_PATH);

    return { data: createdData };
  } catch (error) {
    console.error(error);
    return { error: `Failed to create ${MODULE_NAME}` };
  }
}
