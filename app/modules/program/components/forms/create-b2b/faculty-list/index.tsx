"use client";

import { GraduationCap, Plus } from "lucide-react";
import { Button } from "@ui/button";
import { Field, FieldError, FieldLabel } from "@ui/field";
import FacultySelectPopover from "./faculty-select-popover";
import { SortableGrid } from "./draggable-wrapper";
import { ControllerRenderProps } from "react-hook-form";
import { CreateSchema } from "../schema";

type Props = {
  field: ControllerRenderProps<any, "faculties">;
  fieldState: { invalid: boolean; error?: any };
  isRequired?: boolean;
};

export default function FacultyList({ field, fieldState, isRequired }: Props) {
  const faculties = (field.value || []) as string[];

  const handleAddFaculty = (facultyId: string) => {
    const newFaculties = [...faculties, facultyId];
    field.onChange(newFaculties);
  };

  const handleRemoveFaculty = (facultyId: string) => {
    const newFaculties = faculties.filter((id) => id !== facultyId);
    field.onChange(newFaculties);
  };

  const handleReorder = (reorderedIds: string[]) => {
    field.onChange(reorderedIds);
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
          facultyIds={faculties}
          onRemove={handleRemoveFaculty}
          onReorder={handleReorder}
        />
      ) : (
        <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg border-2 border-dashed">
          <GraduationCap className="size-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No faculty added yet</p>
          <p className="text-sm mb-4">Add faculty members to this program</p>
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
      )}

      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
