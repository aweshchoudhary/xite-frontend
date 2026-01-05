import { getAll } from "@/modules/academic-partner/server/read";

export async function getAcademicPartnersAction() {
  try {
    const academicPartners = await getAll();
    return academicPartners;
  } catch (error) {
    throw error;
  }
}
