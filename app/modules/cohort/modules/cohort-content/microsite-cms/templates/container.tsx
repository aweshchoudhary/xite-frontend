"use client";
import { GetCohort } from "@/modules/cohort/server/cohort/read";
import { useEffect, useState, useCallback } from "react";
import {
  IMicrosite,
  ITemplate,
} from "@microsite-cms/common/services/db/types/interfaces";
import { getMicrositeByCohortKeyAction, getTemplateByIdAction } from "./action";
import CreateForm from "@microsite-cms/microsite/screens/create/form";
import RecordView from "@microsite-cms/microsite/screens/record";
import UpdateForm from "@microsite-cms/microsite/screens/update/form";

export default function TemplatesContainer({ data }: { data: GetCohort }) {
  const cohortKey = data?.cohort_key ?? "";

  return (
    <section className="space-y-6">
      <div className="space-y-8">
        <div className="border-t pt-6">
          <MicrositeView cohort_key={cohortKey} />
        </div>
      </div>
    </section>
  );
}

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

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Choose a template to start.</h3>
      </div>
      <CreateForm cohort_key={cohort_key} />;
    </div>
  );
};
