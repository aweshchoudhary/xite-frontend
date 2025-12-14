import { GetCohort } from "@/modules/cohort/server/cohort/read";
import { Container } from "./container";

export default function CohortCertification({ data }: { data: GetCohort }) {
  return (
    <div className="space-y-6">
      <Container data={data} />
    </div>
  );
}
