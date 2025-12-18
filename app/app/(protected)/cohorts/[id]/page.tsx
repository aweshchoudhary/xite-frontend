"use server";
import { getCohort } from "@/modules/cohort/server/cohort/read";
import { checkPermission } from "@/modules/common/authentication/access-control/lib";
import UnauthorizedPageError from "@/modules/common/components/global/error/unauthorized-page-error";
import { Loader, Book, Key, Calendar, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@ui/badge";
import { enumDisplay } from "@/modules/common/lib/enum-display";
import CopyText from "@/modules/common/components/global/copy-text";
import { format } from "date-fns";
import CohortContent from "@/modules/cohort/modules/cohort-content/cohort-content-container";
import { PageHeader } from "./components/page-header";

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
  const data = await getCohort({ id });

  if (!data) {
    notFound();
  }

  return (
    <div className="spacing space-y-8 mx-auto">
      <PageHeader data={data} />
      <section className="flex items-start lg:gap-10 gap-5">
        <div className="py-5 mb-10 px-8 space-y-6 w-fit! shrink-0 bg-background rounded-md border">
          <div className="grid xl:grid-cols-1 lg:grid-cols-1 grid-cols-1 items-start gap-x-10 gap-y-5">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader className="size-4" strokeWidth={1.5} /> Status
              </div>
              <div>
                <Badge
                  variant={data?.status === "ACTIVE" ? "success" : "outline"}
                  className="capitalize"
                >
                  {enumDisplay(data?.status)}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Book className="size-4" strokeWidth={1.5} /> Program
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Link
                  href={`/programs/${data.program.id}`}
                  className="font-medium hover:underline"
                >
                  {data.program.name}
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Key className="size-4" strokeWidth={1.5} /> Cohort Key
              </div>
              <CopyText value={data.cohort_key || ""}>
                {data.cohort_key}
              </CopyText>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="size-4" strokeWidth={1.5} /> Cohort
                Start-End Date
              </div>
              <div>
                {data.start_date
                  ? format(data.start_date, "MMM d, yyyy")
                  : "Not Set"}{" "}
                -{" "}
                {data.end_date
                  ? format(data.end_date, "MMM d, yyyy")
                  : "Not Set"}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="size-4" strokeWidth={1.5} />
                Assigned To
              </div>
              <div className="capitalize">
                {data.ownerId ? data.owner?.name : "Not Set"}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                Format
              </div>
              <div>{data.format || "N/A"}</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                Duration
              </div>
              <div>{data.duration || "N/A"}</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                Location
              </div>
              <div>{data.location || "N/A"}</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                Max Cohort Size
              </div>
              <div>{data.max_cohort_size || "N/A"}</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                Cohort Fees
              </div>
              <div>
                {data.fees
                  .map((fee) => fee.amount + " " + fee.currency.code)
                  .join(", ") || "N/A"}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-start lg:gap-10 gap-5">
          <CohortContent data={data} />
        </div>
      </section>
    </div>
  );
}
