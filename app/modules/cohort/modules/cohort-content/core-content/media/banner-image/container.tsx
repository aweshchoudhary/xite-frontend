"use client";
import View from "./view";
import { GetCohort } from "@/modules/cohort/server/cohort/read";
import { Image as ImageIcon } from "lucide-react";

type Props = {
  data: GetCohort;
  cohortId: string;
};

export default function Container({ data, cohortId }: Props) {
  return data.media_section ? (
    <div className="group relative bg-card rounded-xl transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3>Banner Image</h3>
      </div>
      <div>
        <View
          data={data.media_section}
          status={data.status}
          cohortId={cohortId}
        />
      </div>
    </div>
  ) : (
    <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg border-2 border-dashed">
      <ImageIcon className="size-8 mx-auto mb-2 opacity-50" />
    </div>
  );
}
