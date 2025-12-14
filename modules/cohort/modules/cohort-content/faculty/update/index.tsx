import { PrimaryDB } from "@/modules/common/database";
import { GraduationCap } from "lucide-react";
import Title from "../title";
import { Button } from "@/modules/common/components/ui/button";
import FacultySelectPopover from "./faculty-select-popover";
import { SortableGrid } from "./draggable-wrapper";
import UpdateMicrositeAdditionalFieldsForm from "./microsite-additional-fields-form/form";

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

export default function Update({ data, onSuccess, onCancel, saveForm }: Props) {
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
        <SortableGrid
          initialItems={
            data?.items
              .sort((a, b) => a.position - b.position)
              .map(
                ({
                  id,
                  position,
                  faculty: { description, profile_image, name },
                }) => ({
                  itemId: id,
                  id: position,
                  position: position,
                  name: name,
                  profile_image: profile_image || "",
                  description: description || "",
                  sectionId: data.id,
                })
              ) || []
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

      <br />
      <br />
      <hr />
      <br />

      <UpdateMicrositeAdditionalFieldsForm
        defaultValues={{
          bottom_description: data?.bottom_description,
          top_description: data?.top_description,
          id: data?.id,
        }}
        saveForm={saveForm}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </div>
  );
}
