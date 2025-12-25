"use client";
import CardList from "./components/card-list";
import { useEffect, useState } from "react";
import { ITemplate } from "../../../common/services/db/types/interfaces";
import { fetchTemplates } from "./actions/fetch";

export default function Templates() {
  const [templates, setTemplates] = useState<ITemplate[]>([]);

  useEffect(() => {
    const fetchTemplatesEffect = async () => {
      const templates = await fetchTemplates();
      setTemplates(templates || []);
    };
    fetchTemplatesEffect();
  }, []);

  if (templates.length === 0) {
    return (
      <div className="min-h-50 bg-accent/50 flex items-center justify-center">
        No templates yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CardList templates={templates} />
    </div>
  );
}
