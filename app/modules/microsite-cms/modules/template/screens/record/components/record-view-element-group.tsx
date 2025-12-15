import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/modules/common/components/ui/field";
import { Input } from "@/modules/common/components/ui/input";
import { ITemplateElement } from "@/modules/common/services/db/types/interfaces";
import RecordViewElement from "./record-view-element";

interface RecordViewElementGroupProps {
  elements: ITemplateElement[];
  fieldArrayName: string;
}

export default function RecordViewElementGroup({
  elements,
  fieldArrayName,
}: RecordViewElementGroupProps) {
  return (
    <div className="rounded-md border border-dashed border-border/50 bg-accent/5 p-4 space-y-4">
      <header className="flex items-center justify-between pb-3 border-b">
        <div>
          <h3 className="text-sm font-medium">Group elements</h3>
          <p className="text-xs text-muted-foreground">
            Define multiple elements inside this block.
          </p>
        </div>
      </header>

      <div className="space-y-5">
        {elements.map((element, index) => (
          <div key={index} className="relative group/element-item">
            <RecordViewElementGroupItem
              element={element}
              index={index}
              fieldArrayName={fieldArrayName}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

interface RecordViewElementGroupItemProps {
  element: ITemplateElement;
  index: number;
  fieldArrayName: string;
}

const RecordViewElementGroupItem = ({
  element,
  index,
  fieldArrayName,
}: RecordViewElementGroupItemProps) => {
  return (
    <div className="w-full relative group/block-item p-4 border border-border/50 bg-background rounded-lg shadow-xs">
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-5">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={`element-title-${index}`}>
                Element Title
              </FieldLabel>
              <Input
                id={`element-title-${index}`}
                value={element.title}
                readOnly
                className="bg-muted"
              />
            </Field>
          </FieldGroup>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={`element-key-${index}`}>
                Element Key
              </FieldLabel>
              <Input
                id={`element-key-${index}`}
                value={element.key}
                readOnly
                className="bg-muted"
              />
            </Field>
          </FieldGroup>
        </div>
        <RecordViewElement element={element} index={index} />
      </div>
    </div>
  );
};
