import { getAll } from "@/modules/enterprise/server/read";

export async function getEnterpriseListAction() {
  try {
    const enterpriseList = await getAll();
    return enterpriseList;
  } catch (error) {
    throw error;
  }
}
