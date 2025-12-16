"use client";
import { GetCohort } from "@/modules/cohort/server/cohort/read";
import { useEffect, useState } from "react";
import {
  IMicrosite,
  ITemplate,
} from "@microsite-cms/common/services/db/types/interfaces";
import {
  getMicrositesByCohortIdAction,
  getTemplatesByCohortIdAction,
} from "./action";
import TemplateCard from "@microsite-cms/template/screens/list/components/card";
import MicrositeCard from "@microsite-cms/microsite/screens/list/components/card";
import {
  Tabs,
  TabsTrigger,
  TabsList,
  TabsContent,
} from "@/modules/common/components/ui/tabs";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function TemplatesContainer({ data }: { data: GetCohort }) {
  return (
    <div>
      <Tabs defaultValue="templates">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="microsite-cms">Microsite CMS</TabsTrigger>
        </TabsList>
        <TabsContent value="templates">
          <TemplatesList cohort_key={data?.cohort_key ?? ""} />
        </TabsContent>
        <TabsContent value="microsite-cms">
          <MicrositeCMSList cohort_key={data?.cohort_key ?? ""} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const TemplatesList = ({ cohort_key }: { cohort_key: string }) => {
  const [templates, setTemplates] = useState<ITemplate[]>([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      const templates = await getTemplatesByCohortIdAction(cohort_key);
      setTemplates(templates);
    };
    fetchTemplates();
  }, [cohort_key]);

  return (
    <div>
      {templates.map((template) => (
        <TemplateCard key={template._id} template={template} />
      ))}

      {templates.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 h-50 bg-accent">
          <Link
            className="flex items-center gap-2"
            href={`/templates/new?cohort_key=${cohort_key}`}
          >
            <Plus className="size-4" /> Template
          </Link>
          <p>No templates found</p>
        </div>
      )}
    </div>
  );
};

const MicrositeCMSList = ({ cohort_key }: { cohort_key: string }) => {
  const [microsites, setMicrosites] = useState<IMicrosite[]>([]);
  useEffect(() => {
    const fetchMicrosites = async () => {
      const microsites = await getMicrositesByCohortIdAction(cohort_key);
      setMicrosites(microsites);
    };
    fetchMicrosites();
  }, [cohort_key]);
  return (
    <div>
      {microsites?.map((microsite) => (
        <MicrositeCard key={microsite._id} microsite={microsite} />
      ))}

      {microsites?.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 h-50 bg-accent">
          <Link
            className="flex items-center gap-2"
            href={`/microsites/new?cohort_key=${cohort_key}`}
          >
            <Plus className="size-4" /> Microsite
          </Link>
          <p>No microsites found</p>
        </div>
      )}
    </div>
  );
};
