"use client";

import { Plus } from "lucide-react";
import { Button } from "@ui/button";
import { Field, FieldError, FieldLabel } from "@ui/field";
import FacultySelectPopover from "./faculty-select-popover";
import { SortableGrid } from "./draggable-wrapper";
import { ControllerRenderProps } from "react-hook-form";

type FacultyItem = {
  facultyId: string;
  position: number;
};

type Props = {
  field: ControllerRenderProps<any, "faculties">;
  fieldState: { invalid: boolean; error?: any };
  isRequired?: boolean;
};

export default function FacultyList({ field, fieldState, isRequired }: Props) {
  const faculties = (field.value || []) as FacultyItem[];

  const handleAddFaculty = (facultyId: string) => {
    const newPosition = faculties.length + 1;
    const newFaculties = [...faculties, { facultyId, position: newPosition }];
    field.onChange(newFaculties);
  };

  const handleRemoveFaculty = (facultyId: string) => {
    const newFaculties = faculties
      .filter((item) => item.facultyId !== facultyId)
      .map((item, index) => ({ ...item, position: index + 1 }));
    field.onChange(newFaculties);
  };

  const handleReorder = (reorderedFaculties: FacultyItem[]) => {
    field.onChange(reorderedFaculties);
  };

  return (
    <Field data-invalid={fieldState.invalid}>
      <div className="flex items-center justify-between mb-3">
        <FieldLabel isRequired={isRequired}>Faculty Members</FieldLabel>
        <FacultySelectPopover
            onSelect={handleAddFaculty}
            selectedFacultyIds={faculties}
          >
            <Button type="button" variant="outline" size="sm">
              <Plus className="size-4 mr-1" />
              Add Faculty
            </Button>
          </FacultySelectPopover>
      </div>

      {faculties.length > 0 ? (
        <SortableGrid
          faculties={faculties}
          onRemove={handleRemoveFaculty}
          onReorder={handleReorder}
        />
      ) : (
        <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg border-2 border-dashed">
          <p className="text-lg font-medium">No faculty added yet</p>
        </div>
      )}

      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
