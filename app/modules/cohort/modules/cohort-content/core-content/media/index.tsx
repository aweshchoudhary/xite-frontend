import { GetCohort } from "@/modules/cohort/server/cohort/read";
import BannerImageContainer from "./banner-image/container";
import UniversityBannerImageContainer from "./university-banner-image/container";
import BrochureContainer from "./brochure/container";
import UniversityLogoContainer from "./university-logo/container";

type Props = {
  data: GetCohort;
};

export default function CohortContentMedia({ data }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid items-start grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="p-6 border rounded-lg bg-background">
            <UniversityLogoContainer data={data} />
          </div>
          <div className="p-6 border rounded-lg bg-background">
            <BrochureContainer data={data} cohortId={data.id} />
          </div>
        </div>
        <div className="space-y-6">
          <div className="p-6 border rounded-lg bg-background">
            <BannerImageContainer cohortId={data.id} data={data} />
          </div>
        </div>
        <div className="p-6 border rounded-lg bg-background">
          <UniversityBannerImageContainer cohortId={data.id} data={data} />
        </div>
      </div>
    </div>
  );
}
