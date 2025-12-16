"use server";
import DataTableView from "@/modules/common/components/global/data-table/data-table-view";
import { columns } from "./schema";
import { getAll } from "@/modules/topic/server/read";

export default async function TopicTable() {
  const { data } = await getAll();
  return <DataTableView data={data ?? []} columns={columns} />;
}


