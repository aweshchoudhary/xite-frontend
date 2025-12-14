import { PrimaryDB, primaryDB } from "@/modules/common/database";

export type GetCohortFee = PrimaryDB.CohortFeeGetPayload<object>;

export async function getMany() {
  try {
    const data = await primaryDB.cohortFee.findMany({
      include: {
        currency: true,
      },
    });
    if (!data) {
      throw new Error("No data list found");
    }
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getOne({ id }: { id: string }) {
  try {
    const data = await primaryDB.cohortFee.findUnique({
      where: { id },
      include: {
        currency: true,
      },
    });

    if (!data) {
      throw new Error("Data not found");
    }

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
