import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { getImageUrl } from "@/modules/common/lib/utils";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

type Props = {
  data?: PrimaryDB.CohortMediaSectionGetPayload<object> | null;
  cohortId: string;
};

export default function View({ data, cohortId }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div className="aspect-square w-30 bg-accent overflow-hidden rounded-md flex items-center justify-center gap-2">
        {data?.university_logo_url ? (
          <Image
            src={getImageUrl(data?.university_logo_url)}
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
      </div>
      <div className="px-3 py-2 border rounded-lg mt-3 text-sm">
        Width: {data?.university_logo_width || "Not Set"}
      </div>
    </div>
  );
}
