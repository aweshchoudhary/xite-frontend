"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/modules/common/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/modules/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/common/components/ui/dialog";
import { ScrollArea } from "@/modules/common/components/ui/scroll-area";

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  actionType: string;
  recordId: string;
  recordName: string;
  recordType: string;
  databaseType: string;
  initialValue?: any;
  finalValue?: any;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const actionTypeColors: Record<string, string> = {
  CREATE: "bg-green-500",
  UPDATE: "bg-blue-500",
  DELETE: "bg-red-500",
  APPROVE: "bg-purple-500",
  REJECT: "bg-orange-500",
  ARCHIVED: "bg-gray-500",
  RESTORE: "bg-cyan-500",
  PUBLISH: "bg-indigo-500",
  UNPUBLISH: "bg-yellow-500",
};

const databaseTypeColors: Record<string, string> = {
  postgresql: "bg-blue-600",
  mongodb: "bg-green-600",
};

function DataViewDialog({ title, data }: { title: string; data: any }) {
  if (!data) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Detailed view of the data at this point in time
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[500px] w-full">
          <pre className="text-xs bg-muted p-4 rounded-md overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export const columns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: "createdAt",
    header: "Time",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {formatDistanceToNow(date, { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground">
            {date.toLocaleString()}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "userName",
    header: "User",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{row.original.userName}</span>
          {row.original.userEmail && (
            <span className="text-xs text-muted-foreground">
              {row.original.userEmail}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "actionType",
    header: "Action",
    cell: ({ row }) => {
      const actionType = row.getValue("actionType") as string;
      return (
        <Badge
          className={`${actionTypeColors[actionType]} text-white hover:opacity-80`}
        >
          {actionType}
        </Badge>
      );
    },
  },
  {
    accessorKey: "recordType",
    header: "Record Type",
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="font-mono">
          {row.getValue("recordType")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "recordName",
    header: "Record Name",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col max-w-[200px]">
          <span className="text-sm font-medium truncate">
            {row.getValue("recordName")}
          </span>
          <span className="text-xs text-muted-foreground font-mono truncate">
            ID: {row.original.recordId}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "databaseType",
    header: "Database",
    cell: ({ row }) => {
      const dbType = row.getValue("databaseType") as string;
      return (
        <Badge
          className={`${databaseTypeColors[dbType]} text-white hover:opacity-80 uppercase`}
        >
          {dbType}
        </Badge>
      );
    },
  },
  {
    id: "data",
    header: "Data",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          {row.original.initialValue && (
            <DataViewDialog
              title="Initial Value"
              data={row.original.initialValue}
            />
          )}
          {row.original.finalValue && (
            <DataViewDialog
              title="Final Value"
              data={row.original.finalValue}
            />
          )}
        </div>
      );
    },
  },
];
