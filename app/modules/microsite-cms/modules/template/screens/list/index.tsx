"use client";
import { useEffect, useState } from "react";
import {
  ITemplate,
  TemplateType,
} from "../../../common/services/db/types/interfaces";
import DataTable from "./components/data-table";
import { Badge } from "@/modules/common/components/ui/badge";
import { getTemplateListAction } from "../../components/template-select-list/action";

export default function Templates() {
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [type, setType] = useState<TemplateType | "all">("all");

  useEffect(() => {
    const fetchTemplatesEffect = async () => {
      const templates = await getTemplateListAction(
        type === "all" ? undefined : type
      );
      setTemplates(templates || []);
    };
    fetchTemplatesEffect();
  }, [type]);

  if (templates.length === 0) {
    return (
      <div className="min-h-50 bg-accent/50 flex items-center justify-center">
        No templates yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-1">
        <Badge
          onClick={() => setType("all")}
          variant={type == "all" ? "default" : "outline"}
          className="cursor-pointer"
        >
          All
        </Badge>
        <Badge
          onClick={() => setType("generic")}
          variant={type == "generic" ? "default" : "outline"}
          className="cursor-pointer"
        >
          Generic
        </Badge>
        <Badge
          onClick={() => setType("program-specific")}
          variant={type == "program-specific" ? "default" : "outline"}
          className="cursor-pointer"
        >
          Program-Specific
        </Badge>
      </div>
      <DataTable templates={templates} />
    </div>
  );
}
