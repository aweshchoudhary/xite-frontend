import { Avatar, AvatarImage } from "@ui/avatar";
import { AvatarFallback } from "@ui/avatar";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { getImageUrl } from "@/modules/common/lib/utils";
import { MessageCircle } from "lucide-react";
import MicrositeAdditionalFieldsView from "../../common/components/microsite-additional-fields-view";

type Props = {
  data?: PrimaryDB.CohortTestimonialSectionGetPayload<{
    include: {
      items: true;
    };
  }> | null;
};

export default function CohortContentTestimonialsView({ data }: Props) {
  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-xl text-foreground">
        {data?.title || "Program Testimonials"}
      </h3>

      {data?.items && data.items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.items.map((item) => (
            <div
              key={item.id}
              className="border border-border rounded-xl p-6 bg-accent/60 transition-all duration-200 space-y-4"
            >
              <div className="relative">
                <MessageCircle className="absolute -top-2 -left-2 size-6 text-primary/20" />
                <div
                  className="italic prose prose-lg font-semibold"
                  dangerouslySetInnerHTML={{ __html: item.quote ?? "" }}
                />
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <Avatar className="size-12">
                  {item.user_image_url && (
                    <AvatarImage src={getImageUrl(item.user_image_url)} />
                  )}
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {item.user_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground truncate">
                    {item.user_name}
                  </h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {item.user_designation}
                  </p>
                  <p className="text-xs text-muted-foreground/80 truncate">
                    {item.user_company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg border-2 border-dashed">
          <MessageCircle className="size-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No testimonials added yet</p>
          <p className="text-sm">
            Click the edit button to add student testimonials
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
