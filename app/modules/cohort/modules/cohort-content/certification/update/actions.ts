"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { UpdateSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { uploadFile } from "@/modules/common/services/file-upload";
import { getLoggedInUser } from "@/modules/user/utils";
import { logUpdate } from "@/modules/common/lib/audit-logger";
import { getAuthUser } from "@/modules/common/authentication/firebase/action";

export type UpdateActionResponse = {
  data: PrimaryDB.CohortCertificationSectionGetPayload<object>;
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
      certificate_image_file_action,
      certificate_image_file,
      certificate_image_url: old_certificate_image_url,
      ...rest
    } = data;
    const currentUser = await getLoggedInUser();
    let certificate_image_url = old_certificate_image_url;

    if (certificate_image_file && certificate_image_file_action === "upload") {
      certificate_image_url = (await uploadFile(certificate_image_file))
        .fileUrl;
    } else if (certificate_image_file_action === "delete") {
      certificate_image_url = null;
    }

    const upsertedData = await primaryDB.cohortCertificationSection.create({
      data: {
        ...rest,
        certificate_image_url,
        cohort: {
          connect: {
            id: cohort_id,
          },
        },
        updated_by: {
          connect: {
            id: currentUser?.dbUser?.id,
          },
        },
      },
    });

    try {
      const user = await getAuthUser();
      if (user) {
        await logUpdate(
          user.uid,
          user.name || user.email || "Unknown User",
          "CohortCertificationSection",
          upsertedData.id,
          upsertedData.title ?? cohort_id,
          "postgresql",
          undefined,
          upsertedData,
          { cohort_id },
        );
      }
    } catch (auditError) {
      console.error("Failed to create audit log:", auditError);
    }

    revalidatePath("/cohorts");

    return { data: upsertedData };
  } catch (error) {
    throw error;
  }
};
