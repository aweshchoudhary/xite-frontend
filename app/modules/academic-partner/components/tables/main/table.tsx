"use server";
import DataTableView from "@/modules/common/components/global/data-table/data-table-view";
import { columns } from "./schema";
import { getAll } from "@/modules/academic-partner/server/read";

export default async function AcademicPartnerTable() {
  const { data } = await getAll();
  return <DataTableView data={data ?? []} columns={columns} />;
}
