"use server";
import { updateOne, UpdateOneOutput } from "@/modules/faculty/server/update";
import { UpdateSchema } from "../schema";
import { revalidatePath } from "next/cache";
import { MODULE_NAME, MODULE_PATH } from "@/modules/faculty/contants";
import { uploadFile } from "@/modules/common/services/file-upload";
import { getOne } from "@/modules/faculty/server/read";

type UpdateActionOutput = {
  error?: string;
  data?: UpdateOneOutput;
};

export async function updateAction(
  data: UpdateSchema,
  id: string
): Promise<UpdateActionOutput> {
  try {
    const {
      profile_image_file,
      profile_image: old_profile_image,
      profile_image_file_action,
      faculty_subject_areas,
      faculty_code_id,
      academic_partner_id,
      ...rest
    } = data;

    let profile_image = old_profile_image;

    if (profile_image_file && profile_image_file_action === "upload") {
      profile_image = (await uploadFile(profile_image_file)).fileUrl;
    } else if (profile_image_file_action === "delete") {
      profile_image = null;
    }

    const faculty = await getOne({ id });
    if (!faculty) {
      throw new Error(`Faculty not found`);
    }

    const subjectAreasToAdd = faculty_subject_areas;
    const subjectAreasToRemove = faculty.faculty_subject_areas.filter(
      (subjectArea) => !faculty_subject_areas.includes(subjectArea.id)
    );

    const updatedData = await updateOne({
      id,
      data: {
        ...rest,
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
        profile_image,
        faculty_subject_areas: {
          connect: subjectAreasToAdd.map((subjectArea) => ({
            id: subjectArea,
          })),
          disconnect: subjectAreasToRemove.map((subjectArea) => ({
            id: subjectArea.id,
          })),
        },
      },
    });

    if (!updatedData) {
      throw new Error(`Failed to update ${MODULE_NAME}`);
    }

    revalidatePath(MODULE_PATH);

    return { data: updatedData };
  } catch (error) {
    console.error(error);
    return { error: `Failed to update ${MODULE_NAME}` };
  }
}
