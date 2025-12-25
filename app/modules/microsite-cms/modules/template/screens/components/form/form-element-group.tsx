import { Field, FieldError, FieldGroup, FieldLabel } from "@ui/field";
import { Input } from "@ui/input";
import {
  Controller,
  UseFieldArrayReturn,
  UseFormReturn,
  useFieldArray,
} from "react-hook-form";
import { TemplateFormInput } from "@microsite-cms/common/services/db/actions/template/schema";
import { Button } from "@ui/button";
import { Plus, PlusIcon, TrashIcon } from "lucide-react";
import slugify from "slugify";
import FormElement from "./form-element";

type FieldArrayName =
  | `pages.${number}.sections.${number}.blocks.${number}.elements`
  | `globalSections.${number}.blocks.${number}.elements`;

interface FormElementGroupProps {
  form: UseFormReturn<TemplateFormInput>;
  fieldArrayName: FieldArrayName;
}

export default function FormElementGroup({
  form,
  fieldArrayName,
}: FormElementGroupProps) {
  const elementFields = useFieldArray({
    control: form.control,
    name: fieldArrayName,
  });
  return (
    <div className="rounded-md border border-dashed border-border/50 bg-accent/5 p-4 space-y-4">
      <header className="flex items-center justify-between pb-3 border-b">
        <div>
          <h3 className="text-sm font-medium">Group elements</h3>
        </div>
        <Button
          onClick={() =>
            elementFields.append({
              key: "",
              title: "",
              type: "text",
              required: true,
            })
          }
          type="button"
          variant="outline"
          size="sm"
          className="gap-2 rounded-full shadow"
        >
          <PlusIcon className="size-4" />
          Element
        </Button>
      </header>

      <div className="space-y-5">
        {elementFields.fields.map((_, index) => (
          <div key={index} className="relative group/element-item">
            <FormElementGroupItem
              key={index}
              form={form}
              index={index}
              elementFields={elementFields}
              fieldArrayName={fieldArrayName}
            />

            <div className="absolute -bottom-3 z-50 right-1/2 -translate-x-1/2 opacity-0 group-hover/element-item:opacity-100 transition-all">
              <Button
                onClick={() =>
                  elementFields.insert(index + 1, {
                    key: "",
                    title: "",
                    type: "text",
                    required: true,
                  })
                }
                variant="outline"
                size="sm"
                type="button"
                className="rounded-full shadow"
              >
                <Plus className="size-4" />
                Element
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface FormElementGroupItemProps {
  form: UseFormReturn<TemplateFormInput>;
  index: number;
  elementFields: UseFieldArrayReturn<TemplateFormInput, FieldArrayName>;
  fieldArrayName: FieldArrayName;
}

const FormElementGroupItem = ({
  form,
  index,
  elementFields,
  fieldArrayName,
}: FormElementGroupItemProps) => {
  return (
    <div className="w-full relative group/block-item p-8 border border-border/50 bg-background rounded-lg shadow-xs">
      <Button
        onClick={() => elementFields.remove(index)}
        size="sm"
        variant="outline"
        type="button"
        className="absolute top-3 z-50 right-3 text-destructive opacity-0 group-hover/element-item:opacity-100 transition-all"
      >
        <TrashIcon className="size-3.5" />
        Element
      </Button>

      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-5">
          <FieldGroup>
            <Controller
              name={`${fieldArrayName}.${index}.title`}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`element-title-${index}`}>
                    Element Title
                  </FieldLabel>
                  <Input
                    {...field}
                    id={`element-title-${index}`}
                    aria-invalid={fieldState.invalid}
                    onChange={(e) => {
                      field.onChange(e);
                      form.setValue(
                        `${fieldArrayName}.${index}.key`,
                        slugify(e.target.value, { lower: true })
                      );
                      form.trigger(`${fieldArrayName}.${index}.key`);
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <FieldGroup>
            <Controller
              name={`${fieldArrayName}.${index}.key`}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`element-key-${index}`}>
                    Element Key
                  </FieldLabel>
                  <Input
                    {...field}
                    id={`element-key-${index}`}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </div>
        <FormElement
          form={form}
          fieldArrayName={fieldArrayName}
          index={index}
        />
      </div>
    </div>
  );
};
