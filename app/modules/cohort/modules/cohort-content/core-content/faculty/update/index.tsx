"use client";

import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { GraduationCap } from "lucide-react";
import Title from "../title";
import { Button } from "@ui/button";
import FacultySelectPopover from "./faculty-select-popover";
import { SortableTable } from "./draggable-wrapper";

type Props = {
  cohortId: string;
  data: PrimaryDB.CohortFacultySectionGetPayload<{
    include: {
      items: {
        include: {
          faculty: {
            include: {
              academic_partner: true;
              faculty_subject_areas: {
                include: {
                  subject_area: true;
                };
              };
            };
          };
        };
      };
    };
  }>;
  onSuccess: () => void;
  onCancel: () => void;
  saveForm: boolean;
};

export default function Update({ data }: Props) {
  if (!data) return null;
  return (
    <div className="bg-card">
      <div className="mb-3 flex justify-between">
        <Title
          title={data?.title || "Faculty"}
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
                sectionId: data.id,
                facultyId: faculty.id,
              })) || []
          }
          selectedFacultyIds={data?.items.map((item) => item.faculty.id) || []}
        />
      ) : (
        <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg border-2 border-dashed">
          <GraduationCap className="size-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No faculty added yet</p>
          <FacultySelectPopover sectionId={data.id} position={0}>
            <Button variant="outline" size="sm">
              Add Faculty
            </Button>
          </FacultySelectPopover>
        </div>
      )}
    </div>
  );
}
