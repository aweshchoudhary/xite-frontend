import { PrimaryDB } from "@/modules/common/database";
import { getImageUrl } from "@/modules/common/lib/utils";
import { Check, ImageIcon, Building, UserCheck, BarChart3 } from "lucide-react";
import Image from "next/image";
import MicrositeAdditionalFieldsView from "../../common/components/microsite-additional-fields-view";

type Props = {
  data?: PrimaryDB.CohortStatisticsSectionGetPayload<{
    include: {
      work_experience_item: true;
      industry_item: {
        include: {
          data_list: {
            include: {
              items: true;
            };
          };
        };
      };
      designation_item: {
        include: {
          data_list: {
            include: {
              items: true;
            };
          };
        };
      };
      company_item: true;
    };
  }> | null;
};

export default function CohortContentDetailsOverviewView({ data }: Props) {
  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-xl text-foreground text-center">
        {data?.title || "Cohort Statistics"}
      </h3>

      {data ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          {/* Work Experience Card */}
          <div className="bg-background border border-border rounded-lg p-4 space-y-4">
            <h4 className="font-semibold text-center text-lg">
              {data?.work_experience_item?.title || "Work Experience"}
            </h4>
            <div className="aspect-video rounded-lg overflow-hidden bg-muted/50 border">
              {data?.work_experience_item?.chart_image_url ? (
                <Image
                  src={getImageUrl(data.work_experience_item.chart_image_url)}
                  alt="Work Experience Chart"
                  width={300}
                  height={300}
                  className="w-full h-full aspect-square object-contain"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <ImageIcon
                    className="size-7 text-muted-foreground"
                    strokeWidth={1}
                  />
                </div>
              )}
            </div>
            <div
              className="prose prose-sm text-center"
              dangerouslySetInnerHTML={{
                __html:
                  data?.work_experience_item?.description ||
                  "<p>No description available</p>",
              }}
            />
          </div>

          {/* Industries Card */}
          <div className="bg-background border border-border rounded-lg p-4 space-y-4">
            <h4 className="font-semibold text-center text-lg">
              {data?.industry_item?.title || "Industries"}
            </h4>
            {data?.industry_item?.data_list?.items &&
            data.industry_item.data_list.items.length > 0 ? (
              <ul className="space-y-2">
                {data.industry_item.data_list.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 p-2 bg-muted/50 rounded-md"
                  >
                    <Check className="size-4 text-green-600 shrink-0" />
                    <span className="text-sm">{item.title}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Building className="size-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No industries added</p>
              </div>
            )}
          </div>

          {/* Designations Card */}
          <div className="bg-background border border-border rounded-lg p-4 space-y-4">
            <h4 className="font-semibold text-center text-lg">
              {data?.designation_item?.title || "Designations"}
            </h4>
            {data?.designation_item?.data_list?.items &&
            data.designation_item.data_list.items.length > 0 ? (
              <ul className="space-y-2">
                {data.designation_item.data_list.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 p-2 bg-muted/50 rounded-md"
                  >
                    <Check className="size-4 text-green-600 shrink-0" />
                    <span className="text-sm">{item.title}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <UserCheck className="size-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No designations added</p>
              </div>
            )}
          </div>

          {/* Companies Card */}
          <div className="bg-background border border-border rounded-lg p-4 space-y-4">
            <h4 className="font-semibold text-center text-lg">
              {data?.company_item?.title || "Companies"}
            </h4>
            <div className="max-w-4xl mx-auto">
              {data?.company_item?.image_url ? (
                <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                  <Image
                    src={getImageUrl(data.company_item.image_url)}
                    alt="Companies"
                    width={800}
                    height={400}
                    className="w-full h-full aspect-square object-contain"
                  />
                </div>
              ) : (
                <div className="aspect-video rounded-lg bg-muted/50 border flex flex-col items-center justify-center">
                  <ImageIcon
                    className="size-7 text-muted-foreground"
                    strokeWidth={1}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground bg-muted/50 rounded-lg border-2 border-dashed">
          <BarChart3 className="size-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No statistics data available</p>
          <p className="text-sm">
            Click the edit button to add cohort statistics
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
