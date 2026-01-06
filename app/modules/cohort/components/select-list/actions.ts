"use server";

import { primaryDB } from "@/modules/common/database/prisma/connection";

export async function getFacultyList() {
  const facultyList = await primaryDB.faculty.findMany({});
  return { data: facultyList };
}
