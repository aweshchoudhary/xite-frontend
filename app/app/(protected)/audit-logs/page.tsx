import AuditLogTable from "@/modules/audit-log/components/tables/main/table";
import DetailPageHeader from "@/modules/common/components/layouts/detail-page-header";
import { Suspense } from "react";

export default function AuditLogsPage() {
  return (
    <div className="flex flex-col gap-4">
      <DetailPageHeader
        title="Audit Logs"
        subtitle="Track all system changes and user activities across the platform"
      />

      <Suspense
        fallback={
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading audit logs...</p>
          </div>
        }
      >
        <AuditLogTable />
      </Suspense>
    </div>
  );
}
