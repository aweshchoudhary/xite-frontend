import CreateForm from "./form";
import { getTemplatesByCohortId } from "@microsite-cms/common/services/db/actions/template/read";

export default async function Create({ cohort_key }: { cohort_key: string }) {
  const templates = await getTemplatesByCohortId(cohort_key);
  return (
    <div>
      <CreateForm templates={templates} />
    </div>
  );
}
