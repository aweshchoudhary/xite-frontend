"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { CreateSchema } from "../schema";
import { revalidatePath } from "next/cache";
import { MODULE_NAME, MODULE_PATH } from "@/modules/enterprise/contants";

type CreateActionOutput = {
  error?: string;
  data?: PrimaryDB.EnterpriseGetPayload<object>;
};

export async function createAction(
  data: CreateSchema
): Promise<CreateActionOutput> {
  try {
    const createdData = await primaryDB.enterprise.create({
      data: data as PrimaryDB.EnterpriseCreateInput,
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
