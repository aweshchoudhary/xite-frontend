"use server";
import DataTableView from "@/modules/common/components/global/data-table/data-table-view";
import { columns } from "./schema";
import { getManyRecords } from "@/modules/common/database/controllers/topic/read";

export default async function TopicTable() {
  const data = await getManyRecords({});
  return <DataTableView data={data ?? []} columns={columns} />;
}


