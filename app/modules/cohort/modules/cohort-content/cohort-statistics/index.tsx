import { GetCohortForDetailPage } from "@/modules/cohort/components/forms/read/get-one-for-detail-page-action";
import { Container } from "./container";

export default function CohortCertification({
  data,
}: {
  data: GetCohortForDetailPage;
}) {
  return (
    <div className="space-y-6">
      <Container data={data} />
    </div>
  );
}
