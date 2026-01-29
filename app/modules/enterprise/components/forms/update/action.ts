"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { UpdateSchema } from "../schema";
import { revalidatePath } from "next/cache";
import { MODULE_NAME, MODULE_PATH } from "@/modules/enterprise/contants";
import { requireAccess } from "@/modules/common/authentication/access-control/middleware/check-access";

type UpdateActionOutput = {
  error?: string;
  data?: PrimaryDB.EnterpriseGetPayload<object>;
};

export async function updateAction(
  data: UpdateSchema,
  id: string,
): Promise<UpdateActionOutput> {
  try {
    await requireAccess("update", "Enterprise");

    const updatedData = await primaryDB.enterprise.update({
      where: { id: id },
      data: data as PrimaryDB.EnterpriseUpdateInput,
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
