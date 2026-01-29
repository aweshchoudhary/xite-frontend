import PageHeader from "@/modules/common/components/global/page-header";
import AuditLogTable from "@/modules/audit-log/components/tables/main/table";
import { Suspense } from "react";
import { Shield } from "lucide-react";

export default function AuditLogsPage() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Audit Logs"
        description="Track all system changes and user activities across the platform"
        icon={Shield}
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
