"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { UpdateSchema } from "../schema";
import { revalidatePath } from "next/cache";
import { MODULE_NAME, MODULE_PATH } from "@/modules/faculty/contants";
import { uploadFile } from "@/modules/common/services/file-upload";
import { requireAccess } from "@/modules/common/authentication/access-control/middleware/check-access";
import { logUpdate } from "@/modules/common/lib/audit-logger";
import { getAuthUser } from "@/modules/common/authentication/firebase/action";

type UpdateActionOutput = {
  error?: string;
  data?: PrimaryDB.FacultyGetPayload<object>;
};

export async function updateAction(
  data: UpdateSchema,
  id: string,
): Promise<UpdateActionOutput> {
  try {
    await requireAccess("update", "Faculty");

    const {
      profile_image_file,
      profile_image: old_profile_image,
      profile_image_file_action,
      faculty_code_id,
      academic_partner_id,
      subtopics,
      ...rest
    } = data;

    let profile_image = old_profile_image;

    if (profile_image_file && profile_image_file_action === "upload") {
      profile_image = (await uploadFile(profile_image_file)).fileUrl;
    } else if (profile_image_file_action === "delete") {
      profile_image = null;
    }

    // Get initial value for audit log
    const initialFaculty = await primaryDB.faculty.findUnique({
      where: { id: id },
      include: { subtopics: true },
    });
    if (!initialFaculty) {
      throw new Error(`Faculty not found`);
    }
    const faculty = initialFaculty;

    // Extract valid subtopic IDs (filter out nulls)
    const validSubtopicIds =
      subtopics?.filter((st) => st.sub_topic_id).map((st) => st.sub_topic_id) ??
      [];

    const subtopicsToAdd = validSubtopicIds;
    const subtopicsToRemove = faculty.subtopics.filter(
      (subtopic) => !validSubtopicIds.includes(subtopic.id),
    );

    const updatedData = await primaryDB.faculty.update({
      where: { id: id },
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
        subtopics: {
          connect: subtopicsToAdd.map((subtopicId) => ({
            id: subtopicId!,
          })),
          disconnect: subtopicsToRemove.map((subtopic) => ({
            id: subtopic.id,
          })),
        },
      },
      include: { subtopics: true },
    });

    if (!updatedData) {
      throw new Error(`Failed to update ${MODULE_NAME}`);
    }

    // Log the audit entry
    try {
      const user = await getAuthUser();
      if (user) {
        await logUpdate(
          user.uid,
          user.name || user.email || "Unknown User",
          "Faculty",
          updatedData.id,
          updatedData.name,
          "postgresql",
          initialFaculty,
          updatedData,
          {
            academicPartnerId: academic_partner_id,
            facultyCodeId: faculty_code_id,
          },
        );
      }
    } catch (auditError) {
      console.error("Failed to create audit log:", auditError);
    }

    revalidatePath(MODULE_PATH);

    return { data: updatedData };
  } catch (error) {
    console.error(error);
    return { error: `Failed to update ${MODULE_NAME}` };
  }
}
