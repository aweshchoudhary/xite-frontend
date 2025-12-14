"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { MODULE_NAME } from "../contants";

export type DeleteOne = PrimaryDB.ProgramGetPayload<object>;

export type DeleteOneInput = {
  id: string;
};

export type DeleteOneOutput = {
  data?: PrimaryDB.ProgramGetPayload<object>;
  error?: string;
};

export async function deleteOne({
  id,
}: {
  id: string;
}): Promise<DeleteOneOutput> {
  try {
    const deletedData = await primaryDB.program.delete({
      where: { id },
    });

    return {
      data: deletedData,
    };
  } catch (error) {
    console.error(error);
    return {
      error: `Failed to delete ${MODULE_NAME}`,
    };
  }
}
