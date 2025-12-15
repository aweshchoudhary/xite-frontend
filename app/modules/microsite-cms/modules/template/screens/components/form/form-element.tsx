import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/modules/common/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/common/components/ui/select";
import { Controller, UseFormReturn } from "react-hook-form";
import { TemplateFormInput } from "@/modules/common/services/db/actions/template/schema";
import { Checkbox } from "@/modules/common/components/ui/checkbox";

type FieldArrayName =
  | `pages.${number}.sections.${number}.blocks.${number}.elements`
  | `globalSections.${number}.blocks.${number}.elements`;

interface FormElementProps {
  form: UseFormReturn<TemplateFormInput>;
  fieldArrayName: FieldArrayName;
  index: number;
}

export default function FormElement({
  form,
  fieldArrayName,
  index,
}: FormElementProps) {
  return (
    <div className="grid grid-cols-2 items-center gap-5">
      <FieldGroup>
        <Controller
          name={`${fieldArrayName}.${index}.type`}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={`element-type-${index}`}>
                Element Type
              </FieldLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="textarea">Textarea</SelectItem>
                  <SelectItem value="richtext">Rich Text</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="file">File</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <FieldGroup>
        <Controller
          name={`${fieldArrayName}.${index}.required`}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`${field.name}-${index}`}
                  checked={!!field.value}
                  aria-invalid={fieldState.invalid}
                  onCheckedChange={(checked) => {
                    const isTrue = checked === true;
                    field.onChange(isTrue);
                  }}
                />
                <FieldLabel htmlFor={`${field.name}-${index}`}>
                  Required
                </FieldLabel>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </div>
  );
}
