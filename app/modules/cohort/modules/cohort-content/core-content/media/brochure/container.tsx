"use client";
import View from "./view";
import { GetCohort } from "@/modules/cohort/server/cohort/read";
import BrochureUpdate from "./upload";
import { FileText } from "lucide-react";
import { Badge } from "@ui/badge";

type Props = {
  data: GetCohort;
  cohortId: string;
};

export default function Container({ data, cohortId }: Props) {
  const isCompleted = data.media_section?.brochure_url;
  return data.media_section ? (
    <div className="group relative bg-card rounded-xl transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3>Brochure</h3>
        <Badge variant={isCompleted ? "success" : "destructive"}>
          {isCompleted ? "Completed" : "Incomplete"}
        </Badge>
      </div>
      <div>
        <View
          data={data.media_section}
          status={data.status}
          cohortId={cohortId}
        />
        <BrochureUpdate cohortId={cohortId} />
      </div>
    </div>
  ) : (
    <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg border-2 border-dashed">
      <FileText className="size-8 mx-auto mb-2 opacity-50" />
      <p>No media section found</p>
    </div>
  );
}
