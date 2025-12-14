"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";

export type DeleteOneOutput = PrimaryDB.EnterpriseGetPayload<object>;

export async function deleteOne({
  id,
}: {
  id: string;
}): Promise<DeleteOneOutput> {
  try {
    const deletedData = await primaryDB.enterprise.delete({
      where: { id },
    });

    return deletedData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
