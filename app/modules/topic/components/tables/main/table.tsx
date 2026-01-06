"use server";
import TopicsGroupedTable from "./topics-grouped-table";
import { primaryDB } from "@/modules/common/database/prisma/connection";

export default async function TopicTable() {
  const data = await primaryDB.topic.findMany({
    include: {
      sub_topics: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return <TopicsGroupedTable data={data ?? []} />;
}
