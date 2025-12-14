import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { getImageUrl } from "@/modules/common/lib/utils";
import { CheckIcon, Gift } from "lucide-react";
import Image from "next/image";
import MicrositeAdditionalFieldsView from "../../../common/components/microsite-additional-fields-view";

type Props = {
  data?: PrimaryDB.CohortBenefitsSectionGetPayload<{
    include: { benefits_items: true };
  }> | null;
};

export default function CohortContentDetailsOverviewView({ data }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">
        {data?.title || "Program Benefits"}
      </h3>

      {data?.benefits_items && data.benefits_items.length > 0 ? (
        <div className="space-y-4">
          {data.benefits_items.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 items-center p-3 bg-accent/50"
            >
              <div className="shrink-0 size-10 rounded-full border bg-background flex items-center justify-center">
                {item.icon_image_url ? (
                  <Image
                    src={getImageUrl(item.icon_image_url)}
                    alt={item.title}
                    width={24}
                    height={24}
                    className="size-6 object-contain"
                  />
                ) : (
                  <CheckIcon className="size-6 text-green-600" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground leading-relaxed text-base">
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg border-2 border-dashed">
          <Gift className="size-8 mx-auto mb-2 opacity-50" />
          <p>No benefits added yet</p>
          <p className="text-sm">
            Click the edit button to add program benefits
          </p>
        </div>
      )}

      <MicrositeAdditionalFieldsView
        top_desc={data?.top_description || ""}
        bottom_desc={data?.bottom_description || ""}
      />
    </div>
  );
}
