import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/modules/common/components/ui/field";
import { Input } from "@/modules/common/components/ui/input";
import { Textarea } from "@/modules/common/components/ui/textarea";
import { ITemplateElement } from "@/modules/common/services/db/types/interfaces";
import RecordViewValueRichtext from "./record-view-value-richtext";
import Image from "next/image";
import { Button } from "@tiptap-ui/components/tiptap-ui-primitive/button";

interface RecordViewValueProps {
  element: ITemplateElement;
  value: unknown;
  index: number;
}

export default function RecordViewValue({
  element,
  value,
  index,
}: RecordViewValueProps) {
  const displayValue = value || "";

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor={`value-${element.key}-${index}`}>
          {element.title}
        </FieldLabel>
        {element.type === "textarea" ? (
          <Textarea
            id={`value-${element.key}-${index}`}
            value={String(displayValue)}
            readOnly
            className="bg-muted"
          />
        ) : null}
        {element.type === "richtext" ? (
          <RecordViewValueRichtext value={String(displayValue)} />
        ) : null}
        {element.type === "text" ? (
          <Input
            id={`value-${element.key}-${index}`}
            value={String(displayValue)}
            readOnly
            className="bg-muted"
          />
        ) : null}

        {element.type === "image" ? (
          <div className="max-w-50! p-3 aspect-square h-auto object-cover bg-muted rounded-lg border">
            <Image
              src={String(
                typeof displayValue === "string"
                  ? displayValue.replace("http://localhost:3000", "")
                  : displayValue
              )}
              alt={element.title}
              width={500}
              height={500}
              className="object-cover"
            />
          </div>
        ) : null}

        {element.type === "video" ? (
          <div className="p-3 aspect-video h-auto object-cover bg-muted rounded-lg border">
            <video src={String(displayValue)} controls />
          </div>
        ) : null}

        {element.type === "file" ? (
          <div className="w-fit max-w-50! p-3 h-auto object-cover bg-muted rounded-lg border">
            <a href={String(displayValue)} download>
              <Button>Download</Button>
            </a>
          </div>
        ) : null}
      </Field>
    </FieldGroup>
  );
}
