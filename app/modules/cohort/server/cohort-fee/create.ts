import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { getLoggedInUser } from "@/modules/user/utils";

export type CreateCohortFeeOutputData = PrimaryDB.CohortFeeGetPayload<object>;

export async function createOne(
  data: PrimaryDB.CohortFeeCreateInput
): Promise<CreateCohortFeeOutputData> {
  try {
    const user = await getLoggedInUser();
    const createdData = await primaryDB.cohortFee.create({
      data: {
        ...data,
        updated_by: {
          connect: {
            id: user.dbUser?.id,
          },
        },
      },
    });

    return createdData;
  } catch (error) {
    throw error;
  }
}
