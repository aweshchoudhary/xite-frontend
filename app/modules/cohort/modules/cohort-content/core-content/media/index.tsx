import { GetCohort } from "@/modules/cohort/server/cohort/read";
import BannerImageContainer from "./banner-image/container";
import UniversityBannerImageContainer from "./university-banner-image/container";
import BrochureContainer from "./brochure/container";
import UniversityLogoContainer from "./university-logo/container";
import { Badge } from "@/modules/common/components/ui/badge";

type Props = {
  data: GetCohort;
};

export default function CohortContentMedia({ data }: Props) {
  const isCompleted =
    data.media_section?.banner_image_url &&
    data.media_section?.university_banner_url &&
    data.media_section?.brochure_url &&
    data.media_section?.university_logo_url;

  if (!data) return null;
  return (
    <div className="space-y-6">
      <Badge variant={isCompleted ? "success" : "destructive"}>
        {isCompleted ? "Completed" : "Incomplete"}
      </Badge>
      <div className="grid items-start grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="p-6 border rounded-lg bg-background">
            <UniversityLogoContainer data={data} cohortId={data.id} />
          </div>
          <div className="p-6 border rounded-lg bg-background">
            <BrochureContainer data={data} cohortId={data.id} />
          </div>
        </div>
        <div className="space-y-6">
          <div className="p-6 border rounded-lg bg-background">
            <BannerImageContainer cohortId={data.id} data={data} />
          </div>
          <div className="p-6 border rounded-lg bg-background">
            <UniversityBannerImageContainer cohortId={data.id} data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
