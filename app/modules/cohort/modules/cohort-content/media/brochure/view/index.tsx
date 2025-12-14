import { buttonVariants } from "@/modules/common/components/ui/button";
import { Label } from "@/modules/common/components/ui/label";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { WorkStatus } from "@/modules/common/database/prisma/generated/prisma";
import { File, FileText, Upload } from "lucide-react";
import BrochureUpdate from "../upload";
import { getImageUrl } from "@/modules/common/lib/utils";
import Link from "next/link";
import { useCheckUserOwnsCohort } from "@/modules/cohort/auth/access";

type Props = {
  data: PrimaryDB.CohortMediaSectionGetPayload<object>;
  cohortId: string;
  status: WorkStatus;
};

export default function View({ data, cohortId, status }: Props) {
  const isUserHasCohortAccess = useCheckUserOwnsCohort(cohortId);
  return (
    <div>
      <div className="block">
        <div className="relative">
          {data.brochure_url ? (
            // <iframe
            //   src={getImageUrl(data.brochure_url)}
            //   className="size-full"
            // ></iframe>
            <div className="size-full flex items-center gap-2">
              <div className="flex items-center justify-center size-14 rounded bg-gray-100 gap-2">
                <FileText
                  className="size-7 text-muted-foreground"
                  strokeWidth={1}
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Borchure is Uploaded</h3>
                <Link
                  href={getImageUrl(data.brochure_url)}
                  target="_blank"
                  className="underline"
                >
                  View/Download
                </Link>
              </div>
            </div>
          ) : (
            <div className="w-full rounded-lg h-full bg-accent flex items-center justify-center gap-2">
              <File className="size-7 text-muted-foreground" strokeWidth={1} />
            </div>
          )}
          {status !== WorkStatus.ACTIVE && isUserHasCohortAccess && (
            <Label className="block" htmlFor="brochure">
              <div className="absolute bottom-3 right-0 flex items-center gap-2">
                <div
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  <Upload className="size-4" />
                  {data.brochure_url ? "Change" : "Upload"}
                </div>
                <BrochureUpdate cohortId={cohortId} />
              </div>
            </Label>
          )}
        </div>
      </div>
    </div>
  );
}
