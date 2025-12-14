import { PrimaryDB, primaryDB } from "@/modules/common/database";
import { MODULE_NAME, MODULE_PATH } from "../contants";
import { revalidatePath } from "next/cache";
import { getLoggedInUser } from "@/modules/user/utils";

export type UpdateOne = PrimaryDB.ProgramGetPayload<object>;

export type UpdateOneInput = {
  id: string;
  data: PrimaryDB.ProgramUpdateInput;
};

export type UpdateOneOutput = {
  data?: PrimaryDB.ProgramGetPayload<object>;
  error?: string;
};

export async function updateOne({
  id,
  data,
}: UpdateOneInput): Promise<UpdateOneOutput> {
  try {
    const user = await getLoggedInUser();
    const updatedData = await primaryDB.program.update({
      where: { id },
      data: {
        ...data,
        updated_by: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    revalidatePath(MODULE_PATH);

    return {
      data: updatedData,
    };
  } catch (error) {
    console.error(error);
    return {
      error: `Failed to update ${MODULE_NAME}`,
    };
  }
}
