import { MODULE_NAME } from "@/modules/academic-partner/contants";
import { getAll } from "@/modules/program/server/read";

export async function getAllAction() {
  try {
    const data = await getAll({ status: "ACTIVE" });
    return data;
  } catch (error) {
    console.error(error);
    return {
      error: `Failed to get all ${MODULE_NAME}`,
    };
  }
}
