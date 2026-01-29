"use server";
import DataTableView from "@/modules/common/components/global/data-table/data-table-view";
import { columns } from "./schema";
import { getAllUsers } from "../../forms/read/action";

export default async function UserTable() {
  const result = await getAllUsers();
  const users = result.data || [];
  
  return <DataTableView data={users} columns={columns} />;
}
