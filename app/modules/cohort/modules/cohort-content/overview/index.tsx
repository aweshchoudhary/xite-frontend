import { GetCohort } from "@/modules/cohort/server/cohort/read";
import { Container as OverviewContainer } from "./overview/container";
import { Container as CurriculumContainer } from "./curriculum/container";
import { Container as BenefitsContainer } from "./benefits/container";
import { Container as WhoShouldApplyContainer } from "./who-should-apply/container";

type Props = {
  data: GetCohort;
};

export default function CohortDetails({ data }: Props) {
  return (
    <div className="grid grid-cols-1 items-start lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="p-6 border rounded-lg bg-background">
          <OverviewContainer data={data} />
        </div>
        <div className="p-6 border rounded-lg bg-background">
          <CurriculumContainer data={data} />
        </div>
      </div>
      <div className="space-y-6">
        <div className="p-6 border rounded-lg bg-background">
          <BenefitsContainer data={data} />
        </div>
        <div className="p-6 border rounded-lg bg-background">
          <WhoShouldApplyContainer data={data} />
        </div>
      </div>
    </div>
  );
}
