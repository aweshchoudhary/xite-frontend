import { cohortStageChange } from "@/scripts/cohort-stage-change";

export default async function CohortStagePlanningPage() {
  const count = await cohortStageChange();
  return <div>Updated {count} cohorts to DRAFT</div>;
}