import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { Label } from "@ui/label";
import { format } from "date-fns";
import { cn } from "@/modules/common/lib/utils";
import { buttonVariants } from "@ui/button";
import Link from "next/link";
import { LinkIcon } from "lucide-react";
import { GetCohort } from "@/modules/cohort/server/cohort/read";
import SectionOrder from "./section-order";

type Props = {
  data?: PrimaryDB.CohortSectionMicrositeSectionGetPayload<object> | null;
  cohortData: GetCohort;
  cohortKey: string;
  previewDomain: string;
  cohort_id: string;
};

export default function CohortContentDetailsOverviewView({
  data,
  cohortKey,
  previewDomain,
  cohort_id,
}: Props) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="grid xl:grid-cols-3 grid-cols-1 gap-6">
        <div>
          <Label className="mb-3">Visibility</Label>
          <div className="flex items-center gap-2">
            <div className={cn(buttonVariants({ variant: "outline" }))}>
              {data?.visibility_start_date
                ? format(data.visibility_start_date, "MMM d, yyyy")
                : "N/A"}
            </div>
            <div>:</div>
            <div className={cn(buttonVariants({ variant: "outline" }))}>
              {data?.visibility_end_date
                ? format(data.visibility_end_date, "MMM d, yyyy")
                : "N/A"}
            </div>
          </div>
        </div>
        <div>
          <Label className="mb-3">Preview Link</Label>
          <div>
            <Link
              href={previewDomain + "/preview/" + cohortKey}
              target="_blank"
              className="flex items-center gap-2 underline text-base"
            >
              <LinkIcon className="w-4 h-4" />
              Preview
            </Link>
          </div>
        </div>
        <div>
          <Label className="mb-3">Custom Domain</Label>
          {/* Custom domain can be long so make wrap */}
          <div className="break-words">{data?.custom_domain || "N/A"}</div>
        </div>
      </div>

      <SectionOrder cohort_id={cohort_id} />
    </div>
  );
}
