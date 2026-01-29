"use client";

import { useState, useEffect } from "react";
import DataTableView from "@/modules/common/components/global/data-table/data-table-view";
import { columns, type AuditLog } from "./schema";
import { getAuditLogsAction } from "../../forms/read/action";
import { Input } from "@/modules/common/components/ui/input";
import { Button } from "@/modules/common/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/common/components/ui/select";
import { Badge } from "@/modules/common/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/modules/common/components/ui/popover";

const ACTION_TYPES = [
  "CREATE",
  "UPDATE",
  "DELETE",
  "APPROVE",
  "REJECT",
  "ARCHIVED",
  "RESTORE",
  "PUBLISH",
  "UNPUBLISH",
];

const RECORD_TYPES = [
  "Program",
  "Cohort",
  "Faculty",
  "AcademicPartner",
  "Enterprise",
  "Microsite",
  "Topic",
  "Template",
];

const DATABASE_TYPES = ["postgresql", "mongodb"];

export default function AuditLogTable() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionType, setActionType] = useState<string>("");
  const [recordType, setRecordType] = useState<string>("");
  const [databaseType, setDatabaseType] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadLogs();
  }, [page, actionType, recordType, databaseType]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const result = await getAuditLogsAction(
        {
          searchTerm: searchTerm || undefined,
          actionType: actionType || undefined,
          recordType: recordType || undefined,
          databaseType: databaseType || undefined,
        },
        { page, limit: 50 }
      );
      setLogs(result.data);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Failed to load audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadLogs();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setActionType("");
    setRecordType("");
    setDatabaseType("");
    setPage(1);
    setTimeout(loadLogs, 0);
  };

  const activeFiltersCount = [actionType, recordType, databaseType].filter(
    Boolean
  ).length;

  const leftActionArea = (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-2 flex-1 min-w-[300px]">
        <Input
          placeholder="Search by user, record name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          className="max-w-sm"
        />
        <Button onClick={handleSearch} size="sm">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge
                variant="destructive"
                className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Filters</h4>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-8"
                >
                  Clear all
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Action Type</label>
              <Select value={actionType} onValueChange={setActionType}>
                <SelectTrigger>
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All actions</SelectItem>
                  {ACTION_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Record Type</label>
              <Select value={recordType} onValueChange={setRecordType}>
                <SelectTrigger>
                  <SelectValue placeholder="All record types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All record types</SelectItem>
                  {RECORD_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Database</label>
              <Select value={databaseType} onValueChange={setDatabaseType}>
                <SelectTrigger>
                  <SelectValue placeholder="All databases" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All databases</SelectItem>
                  {DATABASE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {activeFiltersCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-muted-foreground"
        >
          <X className="h-4 w-4 mr-1" />
          Clear filters
        </Button>
      )}
    </div>
  );

  const rightActionArea = (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        Total: {total.toLocaleString()} logs
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || loading}
        >
          Next
        </Button>
      </div>
    </div>
  );

  if (loading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading audit logs...</p>
      </div>
    );
  }

  return (
    <DataTableView
      data={logs}
      columns={columns}
      leftActionArea={leftActionArea}
      rightActionArea={rightActionArea}
    />
  );
}
