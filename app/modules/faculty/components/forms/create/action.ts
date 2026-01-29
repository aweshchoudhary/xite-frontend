"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { CreateSchema } from "../schema";
import { revalidatePath } from "next/cache";
import { MODULE_NAME, MODULE_PATH } from "@/modules/faculty/contants";
import { uploadFile } from "@/modules/common/services/file-upload";
import { requireAccess } from "@/modules/common/authentication/access-control/middleware/check-access";
import { logCreate } from "@/modules/common/lib/audit-logger";
import { getAuthUser } from "@/modules/common/authentication/firebase/action";

type CreateActionOutput = {
  error?: string;
  data?: PrimaryDB.FacultyGetPayload<object>;
};

export async function createAction(
  data: CreateSchema,
): Promise<CreateActionOutput> {
  try {
    await requireAccess("create", "Faculty");

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
      subtopics?.filter((st) => st.sub_topic_id).map((st) => st.sub_topic_id) ??
      [];

    const createdData = await primaryDB.faculty.create({
      data: {
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
      },
    });

    if (!createdData) {
      throw new Error(`Failed to create ${MODULE_NAME}`);
    }

    // Log the audit entry
    try {
      const user = await getAuthUser();
      if (user) {
        await logCreate(
          user.uid,
          user.name || user.email || "Unknown User",
          "Faculty",
          createdData.id,
          createdData.name,
          "postgresql",
          createdData,
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

    return { data: createdData };
  } catch (error) {
    console.error(error);
    return { error: `Failed to create ${MODULE_NAME}` };
  }
}
