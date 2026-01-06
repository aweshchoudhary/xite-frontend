import { Badge } from "@ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import { getAllAction } from "@/modules/program/components/forms/read/get-all-action";
import Link from "next/link";

export default async function ProgramsTable() {
  const { data: programs } = await getAllAction();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Modified</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {programs?.map((program) => (
          <TableRow key={program.id}>
            <TableCell>
              <Link href={`/programs/${program.id}`}>{program.name}</Link>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="capitalize">
                {program.status.toLowerCase()}
              </Badge>
            </TableCell>
            <TableCell>{program?.updated_at.toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
