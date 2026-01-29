import { getOneForDetailPageAction } from "@/modules/cohort/components/forms/read/get-one-for-detail-page-action";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import UnauthorizedPageError from "@/modules/common/components/global/error/unauthorized-page-error";
import {
  Book,
  Calendar,
  Clock,
  Hash,
  Key,
  Loader2,
  MapPin,
  User,
  Users,
  Banknote,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@ui/badge";
import { enumDisplay } from "@/modules/common/lib/enum-display";
import CopyText from "@/modules/common/components/global/copy-text";
import { format } from "date-fns";
import CohortContent from "@/modules/cohort/modules/cohort-content/cohort-content-container";
import CohortActivityList from "@/modules/cohort/components/cohort-activity-list";
import { PageHeader } from "./components/page-header";
import { generateSEOMetadata } from "@/modules/common/lib/seo";
import type { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getOneForDetailPageAction(id);

  if (!data) {
    return generateSEOMetadata({
      title: "Cohort Not Found",
      description: "The requested cohort could not be found on XITE Platform",
    });
  }

  return generateSEOMetadata({
    title: data.name || `Cohort ${data.cohort_key || id}`,
    description: `View cohort details for ${
      data.name || data.cohort_key || "this cohort"
    } on XITE Platform. Program: ${data.program.name}.`,
    ogTitle: data.name || `Cohort ${data.cohort_key || id}`,
    ogDescription: `Cohort details for ${data.program.name} program on XITE Platform`,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const permission = await checkPermission("Cohort", "read");

  if (!permission) {
    return <UnauthorizedPageError />;
  }

  const { id } = await params;
  const { data } = await getOneForDetailPageAction(id);

  if (!data) {
    notFound();
  }

  return (
    <div className="spacing space-y-6 mx-auto">
      <PageHeader data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left sidebar: cohort details */}
        <aside className="lg:col-span-3 shrink-0">
          <div className="space-y-4 border rounded-lg p-4 bg-card">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Loader2 className="size-3.5" /> Status
              </p>
              <Badge
                variant={data?.status === "ACTIVE" ? "success" : "outline"}
                className="capitalize text-xs"
              >
                {enumDisplay(data?.status)}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Book className="size-3.5" /> Program
              </p>
              <Link
                href={`/programs/${data.program.id}`}
                className="text-sm font-medium hover:underline block truncate"
              >
                {data.program.name}
              </Link>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Key className="size-3.5" /> Cohort Key
              </p>
              <CopyText value={data.cohort_key || ""}>
                <span className="text-sm font-mono truncate block">
                  {data.cohort_key}
                </span>
              </CopyText>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Calendar className="size-3.5" /> Marketing dates
              </p>
              <span className="text-sm">
                {data.mkt_start_date
                  ? format(data.mkt_start_date, "MMM d, yyyy")
                  : "—"}{" "}
                –{" "}
                {data.mkt_end_date
                  ? format(data.mkt_end_date, "MMM d, yyyy")
                  : "—"}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Calendar className="size-3.5" /> Cohort dates
              </p>
              <span className="text-sm">
                {data.start_date
                  ? format(data.start_date, "MMM d, yyyy")
                  : "—"}{" "}
                –{" "}
                {data.end_date
                  ? format(data.end_date, "MMM d, yyyy")
                  : "—"}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <User className="size-3.5" /> Assigned to
              </p>
              <span className="text-sm capitalize">
                {data.ownerId ? data.owner?.name : "—"}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <FileText className="size-3.5" /> Format
              </p>
              <span className="text-sm">{data.format || "—"}</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Clock className="size-3.5" /> Duration
              </p>
              <span className="text-sm">{data.duration || "—"}</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <MapPin className="size-3.5" /> Location
              </p>
              <span className="text-sm">{data.location || "—"}</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Users className="size-3.5" /> Max cohort size
              </p>
              <span className="text-sm">{data.max_cohort_size ?? "—"}</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Banknote className="size-3.5" /> Cohort fees
              </p>
              <span className="text-sm">
                {data.fees?.length
                  ? data.fees
                      .map((fee) => `${fee.amount} ${fee.currency.code}`)
                      .join(", ")
                  : "—"}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Hash className="size-3.5" /> Jira ID
              </p>
              <span className="text-sm font-mono">{data.jira_id || "—"}</span>
            </div>
          </div>
        </aside>

        {/* Middle: cohort content (tabs) */}
        <main className="lg:col-span-6 min-w-0">
          <CohortContent data={data} />
        </main>

        {/* Right: cohort activity */}
        <aside className="lg:col-span-3 shrink-0">
          <Suspense
            fallback={
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Activity</h3>
                <p className="text-xs text-muted-foreground">Loading…</p>
              </div>
            }
          >
            <CohortActivityList cohortId={id} />
          </Suspense>
        </aside>
      </div>
    </div>
  );
}
