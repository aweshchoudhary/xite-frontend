import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";

export type GetCurrency = PrimaryDB.CurrencyGetPayload<object>;

export async function getCurrency({ code }: { code: string }) {
  try {
    const currency = await primaryDB.currency.findUnique({
      where: { code },
    });

    return currency;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
