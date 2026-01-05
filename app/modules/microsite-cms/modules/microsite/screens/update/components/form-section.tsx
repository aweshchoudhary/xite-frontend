import { Field, FieldError, FieldGroup, FieldLabel } from "@ui/field";
import { Input } from "@ui/input";
import {
  Controller,
  UseFieldArrayReturn,
  UseFormReturn,
  useFieldArray,
} from "react-hook-form";
import { MicrositeFormInput } from "@microsite-cms/common/services/db/actions/microsite/schema";
import FormBlock from "./form-block";
import { ITemplateSection } from "@microsite-cms/common/services/db/types/interfaces";
import { Layers, Lock } from "lucide-react";
import { Checkbox } from "@/modules/common/components/ui/checkbox";

type FieldArrayName = `pages.${number}.sections` | `globalSections`;

interface FormSectionProps {
  form: UseFormReturn<MicrositeFormInput>;
  fieldArrayName: FieldArrayName;
  templateSection?: ITemplateSection[];
  title?: string;
}

export default function FormSection({
  form,
  fieldArrayName,
  templateSection = [],
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
      </header>

      {sectionFields.fields.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          <Layers className="size-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No sections available</p>
        </div>
      ) : (
        <div className="space-y-5">
          {sectionFields.fields.map((_, index) => {
            const templateSec = templateSection.find(
              (s) => s.key === form.getValues(`${fieldArrayName}.${index}.key`)
            );
            return (
              <FormSectionItem
                key={index}
                form={form}
                index={index}
                sectionFields={sectionFields}
                fieldArrayName={fieldArrayName}
                templateSection={templateSec}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

interface FormSectionItemProps {
  form: UseFormReturn<MicrositeFormInput>;
  index: number;
  sectionFields: UseFieldArrayReturn<MicrositeFormInput, FieldArrayName>;
  fieldArrayName: FieldArrayName;
  templateSection?: ITemplateSection;
}

const FormSectionItem = ({
  form,
  index,
  fieldArrayName,
  templateSection,
}: FormSectionItemProps) => {
  const sectionTitle =
    templateSection?.title ||
    form.getValues(`${fieldArrayName}.${index}.key`) ||
    `Section ${index + 1}`;

  return (
    <div className="w-full relative p-8 space-y-6 bg-background shadow-xs rounded-xl border border-border/50">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Section {index + 1}
          </p>
          <p className="text-sm text-muted-foreground">{sectionTitle}</p>
        </div>
        <Layers className="size-4 text-muted-foreground" />
      </div>

      <FieldGroup className="grid grid-cols-3 gap-5">
        <Controller
          name={`${fieldArrayName}.${index}.title`}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor={`section-key-${index}`}
                className="flex items-center gap-2"
              >
                Display Title
              </FieldLabel>
              <Input
                {...field}
                id={`section-title-${index}`}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name={`${fieldArrayName}.${index}.key`}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor={`section-key-${index}`}
                className="flex items-center gap-2"
              >
                <Lock className="size-3.5" />
                Section Key
              </FieldLabel>
              <Input
                {...field}
                id={`section-key-${index}`}
                aria-invalid={fieldState.invalid}
                readOnly
                className="bg-muted"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name={`${fieldArrayName}.${index}.visible`}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor={`section-visible-${index}`}
                className="flex items-center gap-2"
              >
                Visible
              </FieldLabel>
              <div>
                <Checkbox
                  value={field.value ? "true" : "false"}
                  id={`section-visible-${index}`}
                  aria-invalid={fieldState.invalid}
                  checked={!!field.value}
                  onCheckedChange={(checked) => {
                    const isTrue = checked === true;
                    field.onChange(isTrue);
                  }}
                />
                <FieldError errors={[fieldState.error]} />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      {templateSection && (
        <FormBlock
          form={form}
          fieldArrayName={`${fieldArrayName}.${index}.blocks`}
          templateBlocks={templateSection.blocks}
        />
      )}
    </div>
  );
};
