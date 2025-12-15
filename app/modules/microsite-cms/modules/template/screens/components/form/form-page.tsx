import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/modules/common/components/ui/field";
import { Input } from "@/modules/common/components/ui/input";
import {
  Controller,
  UseFieldArrayReturn,
  UseFormReturn,
  useFieldArray,
} from "react-hook-form";
import { TemplateFormInput } from "@/modules/common/services/db/actions/template/schema";
import { Button } from "@/modules/common/components/ui/button";
import { Plus, PlusIcon, TrashIcon } from "lucide-react";
import FormSection from "./form-section";
import slugify from "slugify";

interface FormPageProps {
  form: UseFormReturn<TemplateFormInput>;
}

export default function FormPage({ form }: FormPageProps) {
  const pageFields = useFieldArray({
    control: form.control,
    name: "pages",
  });
  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Pages</h2>
        <div>
          <Button
            onClick={() =>
              pageFields.append({ title: "", slug: "", sections: [] })
            }
            type="button"
            variant="light"
            size="sm"
          >
            <PlusIcon className="size-4" /> Page
          </Button>
        </div>
      </header>

      <div className="space-y-5">
        {pageFields.fields.map((_, index) => (
          <div key={index} className="relative group/page-item">
            <FormPageItem
              key={index}
              form={form}
              index={index}
              pageFields={pageFields}
            />
            <Button
              onClick={() =>
                pageFields.insert(index + 1, {
                  title: "",
                  slug: "",
                  sections: [],
                })
              }
              variant="outline"
              size="icon-sm"
              type="button"
              className="rounded-full absolute -bottom-4 z-50 right-1/2 -translate-x-1/2 opacity-0 group-hover/page-item:opacity-100 transition-all"
            >
              <Plus className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

interface FormPageItemProps {
  form: UseFormReturn<TemplateFormInput>;
  index: number;
  pageFields: UseFieldArrayReturn<TemplateFormInput, "pages">;
}

const FormPageItem = ({ form, index, pageFields }: FormPageItemProps) => {
  return (
    <div className="w-full relative space-y-8">
      <Button
        onClick={() => pageFields.remove(index)}
        size="sm"
        variant="ghost"
        type="button"
        className="absolute top-3 z-50 right-3 text-destructive opacity-0 group-hover/page-item:opacity-100 transition-all"
      >
        <TrashIcon className="size-3.5" />
        Remove
      </Button>

      <div className="grid grid-cols-2 gap-5">
        <FieldGroup>
          <Controller
            name={`pages.${index}.title`}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`title-${index}`}>Title</FieldLabel>
                <Input
                  {...field}
                  id={`title-${index}`}
                  aria-invalid={fieldState.invalid}
                  onChange={(e) => {
                    field.onChange(e);
                    form.setValue(
                      `pages.${index}.slug`,
                      slugify(e.target.value, { lower: true })
                    );
                    form.trigger(`pages.${index}.slug`);
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
            name={`pages.${index}.slug`}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`slug-${index}`}>Slug</FieldLabel>
                <Input
                  {...field}
                  id={`slug-${index}`}
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
      <FormSection form={form} fieldArrayName={`pages.${index}.sections`} />
    </div>
  );
};
