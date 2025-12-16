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
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@ui/tabs";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function TemplatesContainer({ data }: { data: GetCohort }) {
  const cohortKey = data?.cohort_key ?? "";

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold leading-tight">
          Templates & Microsites
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage reusable templates and CMS microsites for this cohort.
        </p>
      </header>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-auto">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="microsite-cms">Microsite CMS</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          <TemplatesList cohort_key={cohortKey} />
        </TabsContent>

        <TabsContent value="microsite-cms" className="mt-6">
          <MicrositeCMSList cohort_key={cohortKey} />
        </TabsContent>
      </Tabs>
    </section>
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

  const hasTemplates = templates.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          {hasTemplates
            ? `${templates.length} template${templates.length > 1 ? "s" : ""}`
            : "No templates yet"}
        </div>
        <Link
          className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent"
          href={`/templates/new?cohort_key=${cohort_key}`}
        >
          <Plus className="size-4" /> New template
        </Link>
      </div>

      {hasTemplates ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {templates.map((template) => (
            <TemplateCard key={template._id} template={template} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-accent/40 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Start by creating your first template for this cohort.
          </p>
          <Link
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            href={`/templates/new?cohort_key=${cohort_key}`}
          >
            <Plus className="size-4" /> Create template
          </Link>
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
  const hasMicrosites = (microsites?.length ?? 0) > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          {hasMicrosites
            ? `${microsites.length} microsite${
                microsites.length > 1 ? "s" : ""
              }`
            : "No microsites yet"}
        </div>
        <Link
          className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent"
          href={`/microsites/new?cohort_key=${cohort_key}`}
        >
          <Plus className="size-4" /> New microsite
        </Link>
      </div>

      {hasMicrosites ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {microsites?.map((microsite) => (
            <MicrositeCard key={microsite._id} microsite={microsite} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-accent/40 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Create a microsite to customize the CMS experience for this cohort.
          </p>
          <Link
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            href={`/microsites/new?cohort_key=${cohort_key}`}
          >
            <Plus className="size-4" /> Create microsite
          </Link>
        </div>
      )}
    </div>
  );
};
