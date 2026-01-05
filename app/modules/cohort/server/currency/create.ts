import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { getLoggedInUser } from "@/modules/user/utils";

export type CreateCurrencyOutputData = PrimaryDB.CurrencyGetPayload<object>;

export async function createCurrency({
  code,
  name,
  symbol,
}: {
  code: string;
  name: string;
  symbol: string;
}) {
  try {
    const user = await getLoggedInUser();
    const currency = await primaryDB.currency.create({
      data: {
        code,
        name,
        symbol,

        updated_by: {
          connect: {
            id: user.dbUser?.id,
          },
        },
      },
    });

    return currency;
  } catch (error) {
    throw error;
  }
}
