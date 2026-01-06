"use server";
import DataTableView from "@/modules/common/components/global/data-table/data-table-view";
import { columns } from "./schema";
import { primaryDB } from "@/modules/common/database/prisma/connection";

export default async function TopicTable() {
  const data = await primaryDB.topic.findMany({
    include: {
      sub_topics: true,
    },
  });
  return <DataTableView data={data ?? []} columns={columns} />;
}
