"use client";

import { GraduationCap } from "lucide-react";
import Title from "../title";
import { Button } from "@ui/button";
import ExpertSelectPopover from "./expert-select-popover";
import { SortableTable } from "./draggable-wrapper";
import type { GetCohortForDetailPage } from "@/modules/cohort/components/forms/read/get-one-for-detail-page-action";

type Props = {
  cohortId: string;
  data: GetCohortForDetailPage["industry_experts_section"] | null;
  onSuccess: () => void;
  onCancel: () => void;
  saveForm: boolean;
};

export default function Update({ data, onSuccess, onCancel, saveForm }: Props) {
  return (
    <div className="bg-card">
      <div className="mb-3 flex justify-between">
        <Title
          title={data?.title || "Expert"}
          sectionId={data?.id || ""}
          // onSuccess={onSuccess}
          // onCancel={onCancel}
        />
      </div>

      {data?.items && data.items.length > 0 ? (
        <SortableTable
          initialItems={
            data?.items
              .sort((a, b) => a.position - b.position)
              .map(({ id, position, faculty }) => ({
                itemId: id,
                id: position,
                position: position,
                name: faculty.name,
                profile_image: faculty.profile_image || "",
                description: faculty.description || "",
                title: faculty.title || "",
                academic_partner: faculty.academic_partner,
                sectionId: data?.id || "",
                facultyId: faculty.id,
              })) || []
          }
          selectedExpertIds={data?.items.map((item) => item.faculty.id) || []}
        />
      ) : (
        <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg border-2 border-dashed">
          <GraduationCap className="size-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No expert added yet</p>
          <ExpertSelectPopover sectionId={data?.id || ""} position={0}>
            <Button variant="outline" size="sm">
              Add Expert
            </Button>
          </ExpertSelectPopover>
        </div>
      )}
    </div>
  );
}
