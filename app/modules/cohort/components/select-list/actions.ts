import { getAll } from "@/modules/faculty/server/read";

export async function getFacultyList() {
  const facultyList = await getAll();
  return facultyList;
}
