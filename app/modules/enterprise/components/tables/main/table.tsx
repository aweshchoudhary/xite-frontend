"use server";
import DataTableView from "@/modules/common/components/global/data-table/data-table-view";
import { columns } from "./schema";
import { primaryDB } from "@/modules/common/database/prisma/connection";

export default async function EnterpriseTable() {
  const data = await primaryDB.enterprise.findMany({});
  return <DataTableView data={data} columns={columns} />;
}
