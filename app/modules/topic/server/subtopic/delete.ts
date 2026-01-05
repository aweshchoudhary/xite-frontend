"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { MODULE_PATH } from "../../contants";
import { revalidatePath } from "next/cache";

export type DeleteOneOutput = PrimaryDB.SubTopicGetPayload<object>;

export async function deleteOne({
  id,
}: {
  id: string;
}): Promise<DeleteOneOutput> {
  try {
    const deletedData = await primaryDB.subTopic.delete({
      where: { id },
    });

    revalidatePath(MODULE_PATH);

    return deletedData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


