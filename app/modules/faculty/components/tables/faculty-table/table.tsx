"use server";
import DataTableView from "@/modules/common/components/global/data-table/data-table-view";
import { columns } from "./schema";
import { getAll } from "@/modules/faculty/server/read";
export default async function FacultyTable() {
  const faculties = await getAll();
  return <DataTableView data={faculties} columns={columns} />;
}
