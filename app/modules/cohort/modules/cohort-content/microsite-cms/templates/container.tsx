"use client";
import { GetCohort } from "@/modules/cohort/server/cohort/read";
import { useEffect, useState } from "react";
import { ITemplate } from "@/modules/microsite-cms/modules/common/services/db/types/interfaces";
import { getTemplatesByCohortIdAction } from "./action";

export default function TemplatesContainer({ data }: { data: GetCohort }) {
  const [templates, setTemplates] = useState<ITemplate[]>([]);

  useEffect(() => {
    getTemplatesByCohortIdAction(data.id).then((templates: ITemplate[]) => {
      setTemplates(templates);
    });
  }, [data.id]);

  console.log({ templates });

  return (
    <div>
      {templates.map((template) => (
        <div key={template._id}>
          <h3>{template.name}</h3>
        </div>
      ))}
    </div>
  );
}
