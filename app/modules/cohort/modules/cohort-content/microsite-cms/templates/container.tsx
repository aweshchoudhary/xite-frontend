"use client";
import { GetCohort } from "@/modules/cohort/server/cohort/read";
import { useEffect, useState } from "react";
import {
  IMicrosite,
  ITemplate,
} from "@microsite-cms/common/services/db/types/interfaces";
import {
  getMicrositeByCohortKeyAction,
  getTemplatesByCohortIdAction,
  getTemplateByIdAction,
} from "./action";
import TemplateCard from "@microsite-cms/template/screens/list/components/card";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@ui/tabs";
import Link from "next/link";
import { Plus } from "lucide-react";
import CreateForm from "@microsite-cms/microsite/screens/create/form";
import RecordView from "@microsite-cms/microsite/screens/record";

export default function TemplatesContainer({ data }: { data: GetCohort }) {
  const cohortKey = data?.cohort_key ?? "";

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold leading-tight">
          Templates & Microsite
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage reusable templates and CMS microsite for this cohort.
        </p>
      </header>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-auto">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="microsite">Microsite</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          <TemplatesList cohort_key={cohortKey} />
        </TabsContent>

        <TabsContent value="microsite" className="mt-6">
          <MicrositeView cohort_key={cohortKey} />
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
          <Plus className="size-4" /> Template
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
          <p className="text-sm text-muted-foreground">No templates yet.</p>
          <Link
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            href={`/templates/new?cohort_key=${cohort_key}`}
          >
            <Plus className="size-4" /> Template
          </Link>
        </div>
      )}
    </div>
  );
};

const MicrositeView = ({ cohort_key }: { cohort_key: string }) => {
  const [microsite, setMicrosite] = useState<IMicrosite | null>(null);
  const [template, setTemplate] = useState<ITemplate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMicrosite = async () => {
      try {
        const micrositeData = await getMicrositeByCohortKeyAction(cohort_key);
        setMicrosite(micrositeData);
        if (micrositeData?.templateId) {
          const templateData = await getTemplateByIdAction(
            micrositeData.templateId
          );
          setTemplate(templateData);
        }
      } catch (error) {
        console.error("Error fetching microsite:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMicrosite();
  }, [cohort_key]);

  if (loading) {
    return (
      <div className="flex min-h-[220px] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (microsite && template) {
    return <RecordView microsite={microsite} template={template} />;
  }

  return <CreateForm cohort_key={cohort_key} />;
};
