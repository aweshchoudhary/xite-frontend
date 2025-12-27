"use client";
import { Badge } from "@ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import { ITemplate } from "@microsite-cms/common/services/db/types/interfaces";
import Link from "next/link";
import DataTableActions from "./data-table-actions";

export default function DataTable({ templates }: { templates: ITemplate[] }) {
  return (
    <Table>
      <TableCaption>A list of your recent templates.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {templates.map((template) => (
          <TableRow key={template._id}>
            <TableCell className="font-medium">
              <Link
                className="hover:underline underline-offset-4"
                href={`/templates/${template._id}`}
              >
                {template.name}
              </Link>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{template.type}</Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={template.status === "active" ? "success" : "secondary"}
              >
                {template.status}
              </Badge>
            </TableCell>
            <TableCell>
              <DataTableActions />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
