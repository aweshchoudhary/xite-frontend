"use client";
import { GetCohort } from "@/modules/cohort/server/cohort/read";
import { useEffect, useState, useCallback } from "react";
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
import Link from "next/link";
import { Plus } from "lucide-react";
import CreateForm from "@microsite-cms/microsite/screens/create/form";
import RecordView from "@microsite-cms/microsite/screens/record";
import UpdateForm from "@microsite-cms/microsite/screens/update/form";

export default function TemplatesContainer({ data }: { data: GetCohort }) {
  const cohortKey = data?.cohort_key ?? "";

  return (
    <section className="space-y-6">
      <div className="space-y-8">
        <TemplatesList cohort_key={cohortKey} />
        <div className="border-t pt-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Microsite</h3>
          </div>
          <MicrositeView cohort_key={cohortKey} />
        </div>
      </div>
    </section>
  );
}

const TemplatesList = ({ cohort_key }: { cohort_key: string }) => {
  const [templates, setTemplates] = useState<ITemplate[]>([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      const allTemplates = await getTemplatesByCohortIdAction(cohort_key);
      // Only show cohort templates (exclude fixed templates)
      const cohortTemplates = allTemplates.filter(
        (template) => template.type !== "fixed"
      );
      setTemplates(cohortTemplates);
    };
    fetchTemplates();
  }, [cohort_key]);

  const hasTemplates = templates.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="lg:text-xl text-lg font-semibold">Templates</h2>
        </div>
        <Link
          className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent"
          href={`/templates/new?cohort_key=${cohort_key}`}
        >
          <Plus className="size-4" /> Template
        </Link>
      </div>

      {hasTemplates ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
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
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchMicrosite = useCallback(async () => {
    try {
      setLoading(true);
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
  }, [cohort_key]);

  useEffect(() => {
    fetchMicrosite();
  }, [fetchMicrosite]);

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
  };

  const handleSaveSuccess = async () => {
    await fetchMicrosite();
    setIsEditMode(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[220px] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (microsite && template) {
    if (isEditMode) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Edit Microsite</h3>
            <button
              onClick={handleCancel}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
          <UpdateForm
            microsite={microsite}
            template={template}
            onSaveSuccess={handleSaveSuccess}
          />
        </div>
      );
    }
    return (
      <RecordView
        microsite={microsite}
        template={template}
        onEdit={handleEdit}
      />
    );
  }

  return <CreateForm cohort_key={cohort_key} />;
};
