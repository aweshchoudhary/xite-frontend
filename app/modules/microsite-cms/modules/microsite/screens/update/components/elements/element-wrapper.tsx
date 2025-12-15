import {
  Field,
  FieldError,
  FieldLabel,
  FieldGroup,
} from "@/modules/common/components/ui/field";
import { MicrositeFormInput } from "@/modules/common/services/db/actions/microsite/schema";
import { Controller, FieldArrayPath, UseFormReturn } from "react-hook-form";
import { ITemplateElement } from "@/modules/common/services/db/types/interfaces";
import TextElement from "./text";
import TextareaElement from "./textarea";
import ImageElement from "./image";
import RichTextElement from "./richtext";
import VideoElement from "./video";
import FileElement from "./file";

type FieldArrayName = FieldArrayPath<MicrositeFormInput>;

interface TextElementProps {
  form: UseFormReturn<MicrositeFormInput>;
  fieldArrayName: FieldArrayName;
  index: number;
  element: ITemplateElement;
  type: "text" | "textarea" | "richtext" | "image" | "file" | "video";
  label?: string;
}

export default function ElementWrapper({
  form,
  fieldArrayName,
  index,
  element,
  type,
  label,
}: TextElementProps) {
  return (
    <FieldGroup key={element.key}>
      <Controller
        name={fieldArrayName}
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel
              htmlFor={`${field.name}-${index}-${element.key}`}
              className="flex items-center gap-1.5"
            >
              {label || element.title} ({type})
              {element.required && <span className="text-destructive">*</span>}
            </FieldLabel>

            {type === "text" && (
              <TextElement index={index} field={field} element={element} />
            )}
            {type === "textarea" && (
              <TextareaElement index={index} field={field} element={element} />
            )}
            {type === "richtext" && (
              <RichTextElement index={index} field={field} element={element} />
            )}
            {type === "video" && (
              <VideoElement index={index} field={field} element={element} />
            )}
            {type === "file" && (
              <FileElement index={index} field={field} element={element} />
            )}
            {type === "image" && (
              <ImageElement index={index} field={field} element={element} />
            )}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
}
