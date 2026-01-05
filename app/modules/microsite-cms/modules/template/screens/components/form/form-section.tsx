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
import FormBlock from "./form-block";
import slugify from "slugify";

type FieldArrayName = `pages.${number}.sections` | `globalSections`;

interface FormSectionProps {
  form: UseFormReturn<TemplateFormInput>;
  fieldArrayName: FieldArrayName;
  title?: string;
}

export default function FormSection({
  form,
  fieldArrayName,
  title = "Sections",
}: FormSectionProps) {
  const sectionFields = useFieldArray({
    control: form.control,
    name: fieldArrayName,
  });
  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div>
          <Button
            onClick={() =>
              sectionFields.append({ key: "", title: "", blocks: [] })
            }
            type="button"
            variant="outline"
          >
            <PlusIcon className="size-4" /> Section
          </Button>
        </div>
      </header>

      {sectionFields.fields.length === 0 && (
        <div className="p-10 border text-center bg-background">
          <p className="text-sm">No sections yet.</p>
        </div>
      )}

      {sectionFields.fields.map((_, index) => (
        <div key={index} className="relative group/section-item">
          <FormSectionItem
            key={index}
            form={form}
            index={index}
            sectionFields={sectionFields}
            fieldArrayName={fieldArrayName}
          />
          <div className="absolute -bottom-3 z-50 right-1/2 -translate-x-1/2 opacity-0 group-hover/section-item:opacity-100 transition-all">
            <Button
              onClick={() =>
                sectionFields.insert(index + 1, {
                  key: "",
                  title: "",
                  blocks: [],
                })
              }
              variant="outline"
              size="sm"
              type="button"
              className="rounded-full shadow"
            >
              <Plus className="size-4" />
              Section
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

interface FormSectionItemProps {
  form: UseFormReturn<TemplateFormInput>;
  index: number;
  sectionFields: UseFieldArrayReturn<TemplateFormInput, FieldArrayName>;
  fieldArrayName: FieldArrayName;
}

const FormSectionItem = ({
  form,
  index,
  sectionFields,
  fieldArrayName,
}: FormSectionItemProps) => {
  return (
    <div className="w-full p-8 space-y-5 bg-background shadow-xs border rounded-xl">
      <Button
        onClick={() => sectionFields.remove(index)}
        size="sm"
        variant="outline"
        type="button"
        className="absolute top-3 z-50 right-3 text-destructive opacity-0 group-hover/section-item:opacity-100 transition-all"
      >
        <TrashIcon className="size-3.5" />
        Section
      </Button>

      <div className="grid grid-cols-2 gap-5">
        <FieldGroup>
          <Controller
            name={`${fieldArrayName}.${index}.title`}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`section-title-${index}`}>
                  Title
                </FieldLabel>
                <Input
                  {...field}
                  id={`section-title-${index}`}
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
                <FieldLabel htmlFor={`section-key-${index}`}>Key</FieldLabel>
                <Input
                  {...field}
                  id={`section-key-${index}`}
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

      <FormBlock
        form={form}
        fieldArrayName={`${fieldArrayName}.${index}.blocks`}
      />
    </div>
  );
};
