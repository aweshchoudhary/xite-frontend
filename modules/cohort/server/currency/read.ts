import { PrimaryDB, primaryDB } from "@/modules/common/database";

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
