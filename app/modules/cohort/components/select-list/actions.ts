"use server";

import { getManyRecords } from "@/modules/common/database/controllers/faculty/read";

export async function getFacultyList() {
  const facultyList = await getManyRecords({});
  return { data: facultyList };
}
