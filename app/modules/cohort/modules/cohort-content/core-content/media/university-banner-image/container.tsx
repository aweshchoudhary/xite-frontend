"use client";
import View from "./view";
import { GetCohort } from "@/modules/cohort/server/cohort/read";

type Props = {
  data: GetCohort;
  cohortId: string;
};

export default function Container({ data, cohortId }: Props) {
  return data.media_section ? (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h3>University Banner Image</h3>
      </div>
      <View
        data={data.media_section}
        status={data.status}
        cohortId={cohortId}
      />
    </div>
  ) : (
    <div>
      <p>No media section found</p>
    </div>
  );
}
