"use server";
import DataTableView from "@/modules/common/components/global/data-table/data-table-view";
import { columns } from "./schema";
import { getManyRecords } from "@/modules/common/database/controllers/enterprise/read";

export default async function EnterpriseTable() {
  const data = await getManyRecords({});
  return <DataTableView data={data} columns={columns} />;
}
