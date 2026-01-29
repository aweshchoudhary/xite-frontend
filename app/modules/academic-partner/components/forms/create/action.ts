"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { CreateSchema } from "../schema";
import { revalidatePath } from "next/cache";
import { MODULE_NAME, MODULE_PATH } from "@/modules/academic-partner/contants";
import { uploadFile } from "@/modules/common/services/file-upload";
import { requireAccess } from "@/modules/common/authentication/access-control/middleware/check-access";
import { logCreate } from "@/modules/common/lib/audit-logger";
import { getAuthUser } from "@/modules/common/authentication/firebase/action";

type CreateActionOutput = {
  error?: string;
  data?: PrimaryDB.AcademicPartnerGetPayload<object>;
};

export async function createAction(
  data: CreateSchema,
): Promise<CreateActionOutput> {
  try {
    await requireAccess("create", "AcademicPartner");

    const { logo_file, ...rest } = data;
    let logo_url = null;

    if (logo_file) {
      logo_url = (await uploadFile(logo_file)).fileUrl;
    }

    const createdData = await primaryDB.academicPartner.create({
      data: {
        ...rest,
        logo_url,
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
          "AcademicPartner",
          createdData.id,
          createdData.name,
          "postgresql",
          createdData,
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
