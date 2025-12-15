import CreateForm from "./form";
import { getTemplates } from "@/modules/common/services/db/actions/template/read";

export default async function Create() {
  const templates = await getTemplates();
  return (
    <div>
      <CreateForm templates={templates} />
    </div>
  );
}
