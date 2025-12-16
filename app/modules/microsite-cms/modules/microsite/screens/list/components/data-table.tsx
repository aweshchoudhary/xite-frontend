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
import { IMicrosite } from "@/modules/common/services/db/types/interfaces";
import Link from "next/link";
import DataTableActions from "./data-table-actions";

export default function DataTable({
  microsites,
}: {
  microsites: IMicrosite[];
}) {
  return (
    <Table>
      <TableCaption>A list of your recent microsites.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Modified</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {microsites.map((microsite) => (
          <TableRow key={microsite._id}>
            <TableCell className="font-medium">
              <Link
                className="hover:underline underline-offset-4"
                href={`/microsites/${microsite._id}`}
              >
                {microsite.title}
              </Link>
            </TableCell>
            <TableCell>
              <Badge>Active</Badge>
            </TableCell>
            <TableCell>Now</TableCell>
            <TableCell>
              <DataTableActions />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
