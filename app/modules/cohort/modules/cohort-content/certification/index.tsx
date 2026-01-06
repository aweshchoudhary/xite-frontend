import type { GetCohort } from "@/modules/cohort/components/forms/read/action";
import { Container } from "./container";

export default function CohortCertification({ data }: { data: GetCohort }) {
  return (
    <div className="space-y-6">
      <Container data={data} />
    </div>
  );
}
