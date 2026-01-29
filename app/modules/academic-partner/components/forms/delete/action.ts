"use server";
import { MODULE_NAME, MODULE_PATH } from "@/modules/academic-partner/contants";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { revalidatePath } from "next/cache";
import { requireAccess } from "@/modules/common/authentication/access-control/middleware/check-access";

type DeleteActionOutput = {
  error?: string;
  data?: PrimaryDB.AcademicPartnerGetPayload<object>;
};

export async function deleteAction(id: string): Promise<DeleteActionOutput> {
  try {
    await requireAccess("delete", "AcademicPartner");

    const deletedData = await primaryDB.academicPartner.delete({
      where: { id: id },
    });

    revalidatePath(MODULE_PATH);

    return { data: deletedData };
  } catch (error) {
    console.error(error);
    return { error: `Failed to delete ${MODULE_NAME}` };
  }
}
