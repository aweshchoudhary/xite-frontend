import { Field, FieldGroup, FieldLabel } from "@ui/field";
import { ITemplateElement } from "@microsite-cms/common/services/db/types/interfaces";
import { Badge } from "@ui/badge";

interface RecordViewElementProps {
  element: ITemplateElement;
  index: number;
}

export default function RecordViewElement({
  element,
  index,
}: RecordViewElementProps) {
  return (
    <div className="grid grid-cols-2 items-center gap-5">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={`element-type-${index}`}>
            Element Type
          </FieldLabel>
          <div className="px-3 py-2 border rounded-md bg-background">
            <Badge variant="outline">{element.type}</Badge>
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
              {element.required ? (
                <Badge variant="default">Yes</Badge>
              ) : (
                <Badge variant="secondary">No</Badge>
              )}
            </div>
          </div>
        </Field>
      </FieldGroup>
    </div>
  );
}
