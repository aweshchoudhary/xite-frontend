import { Field, FieldGroup, FieldLabel } from "@ui/field";
import { ITemplateElement } from "@/modules/common/services/db/types/interfaces";

interface RecordViewElementSingleProps {
  element: ITemplateElement;
  index: number;
  fieldArrayName?: string;
}

export default function RecordViewElementSingle({
  element,
  index,
}: RecordViewElementSingleProps) {
  if (!element) {
    return null;
  }

  return (
    <div className="rounded-md border border-dashed border-border/50 bg-muted/40 p-4">
      <div className="grid grid-cols-2 items-center gap-5">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={`element-type-${index}`}>
              Element Type
            </FieldLabel>
            <div className="px-3 py-2 border rounded-md bg-background">
              <span className="text-sm">{element.type}</span>
            </div>
          </Field>
        </FieldGroup>
        <FieldGroup>
          <Field>
            <div className="flex items-center gap-2">
              <FieldLabel htmlFor={`element-required-${index}`}>
                Required
              </FieldLabel>
              <div className="px-3 py-2 border rounded-md bg-background">
                <span className="text-sm">
                  {element.required ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </Field>
        </FieldGroup>
      </div>
    </div>
  );
}
