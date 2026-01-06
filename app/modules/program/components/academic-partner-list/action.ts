"use server";

import { getManyRecords } from "@/modules/common/database/controllers/academic-partner/read";

export async function getAcademicPartnersAction() {
  try {
    const academicPartners = await getManyRecords({});
    return { data: academicPartners };
  } catch (error) {
    throw error;
  }
}
