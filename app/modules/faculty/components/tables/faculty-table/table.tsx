"use server";
import DataTableView from "@/modules/common/components/global/data-table/data-table-view";
import { columns } from "./schema";
import { primaryDB } from "@/modules/common/database/prisma/connection";
export default async function FacultyTable() {
  const faculties = await primaryDB.faculty.findMany({});
  return <DataTableView data={faculties} columns={columns} />;
}
