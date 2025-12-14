import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { revalidatePath } from "next/cache";
import { MODULE_NAME, MODULE_PATH } from "../contants";
import { getLoggedInUser } from "@/modules/user/utils";

export type CreateOne = PrimaryDB.ProgramGetPayload<object>;

export type CreateOneInput = {
  data: PrimaryDB.ProgramCreateInput;
};

export type CreateOneOutput = {
  data?: PrimaryDB.ProgramGetPayload<object>;
  error?: string;
};

export async function createOne({
  data,
}: CreateOneInput): Promise<CreateOneOutput> {
  try {
    const user = await getLoggedInUser();

    const newData = await primaryDB.program.create({
      data: {
        ...data,
        updated_by: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    if (!newData) {
      throw new Error(`Failed to create ${MODULE_NAME}`);
    }

    revalidatePath(MODULE_PATH);

    return {
      data: newData,
    };
  } catch (error) {
    console.error(error);
    return {
      error: `Failed to create ${MODULE_NAME}`,
    };
  }
}
