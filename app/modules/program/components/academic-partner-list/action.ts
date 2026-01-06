"use server";

import { primaryDB } from "@/modules/common/database/prisma/connection";

export async function getAcademicPartnersAction() {
  try {
    const academicPartners = await primaryDB.academicPartner.findMany({});
    return { data: academicPartners };
  } catch (error) {
    throw error;
  }
}
