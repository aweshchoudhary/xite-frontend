"use server";
import DataTableView from "@/modules/common/components/global/data-table/data-table-view";
import { columns } from "./schema";
import { getManyRecords } from "@/modules/common/database/controllers/faculty/read";
export default async function FacultyTable() {
  const faculties = await getManyRecords({});
  return <DataTableView data={faculties} columns={columns} />;
}
