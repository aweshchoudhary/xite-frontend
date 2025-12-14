import { buttonVariants } from "@/modules/common/components/ui/button";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { WorkStatus } from "@/modules/common/database/prisma/generated/prisma";
import { ImageIcon, Upload } from "lucide-react";
import Image from "next/image";
import BannerUpdate from "../upload";
import { Label } from "@/modules/common/components/ui/label";
import { getImageUrl } from "@/modules/common/lib/utils";
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
      <Label className="block" htmlFor="university-banner-image">
        <div className="aspect-video relative w-full bg-accent overflow-hidden rounded-lg flex items-center justify-center gap-2">
          {data.university_banner_url ? (
            <Image
              src={getImageUrl(data.university_banner_url)}
              alt="Banner Image"
              width={500}
              height={500}
              className="object-cover size-full"
            />
          ) : (
            <div className="flex items-center gap-2">
              <ImageIcon
                className="size-7 text-muted-foreground"
                strokeWidth={1}
              />
            </div>
          )}
          {status !== WorkStatus.ACTIVE && isUserHasCohortAccess && (
            <div className="absolute bottom-3 right-0 flex items-center gap-2">
              <div
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                <Upload className="size-4" />
                {data.university_banner_url ? "Change" : "Upload"}
              </div>
              <BannerUpdate
                cohortId={cohortId}
                fieldName="university-banner-image"
              />
            </div>
          )}
        </div>
      </Label>
    </div>
  );
}
