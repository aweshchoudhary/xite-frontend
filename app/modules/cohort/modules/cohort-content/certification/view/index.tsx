import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { getImageUrl } from "@/modules/common/lib/utils";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import MicrositeAdditionalFieldsView from "../../common/components/microsite-additional-fields-view";

type Props = {
  data?: PrimaryDB.CohortCertificationSectionGetPayload<object> | null;
};

export default function CohortContentDetailsOverviewView({ data }: Props) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-between">
        <h3 className="h3 font-semibold mb-2 w-full">
          {data?.title || "Program Certification"}
        </h3>
      </div>
      <div className="lg:w-1/2 mx-auto mt-5">
        {data?.certificate_image_url ? (
          <Image
            src={getImageUrl(data?.certificate_image_url)}
            alt="Certificate Image"
            width={800}
            height={800}
            className="w-full h-auto object-cover"
          />
        ) : (
          <div className="aspect-video rounded-lg w-full bg-accent flex flex-col items-center justify-center">
            <ImageIcon className="size-14 text-muted-foreground" />
            <p className="text-muted-foreground"> Select Image</p>
          </div>
        )}
      </div>
      <MicrositeAdditionalFieldsView
        top_desc={data?.top_description || ""}
        bottom_desc={data?.bottom_description || ""}
      />
    </div>
  );
}
