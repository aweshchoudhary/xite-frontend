"use client";
import { Field, FieldError, FieldGroup, FieldLabel } from "@ui/field";
import { Input } from "@ui/input";
import { Controller, UseFormReturn, useFieldArray } from "react-hook-form";
import { MicrositeFormInput } from "@microsite-cms/common/services/db/actions/microsite/schema";
import { FileText, Lock } from "lucide-react";
import FormSection from "./form-section";
import { ITemplate } from "@microsite-cms/common/services/db/types/interfaces";
import { Textarea } from "@ui/textarea";

interface FormPageProps {
  form: UseFormReturn<MicrositeFormInput>;
  template: ITemplate;
}

export default function FormPage({ form, template }: FormPageProps) {
  const pageFields = useFieldArray({
    control: form.control,
    name: "pages",
  });

  if (pageFields.fields.length === 0) {
    return (
      <div className="py-12">
        <div className="text-center text-muted-foreground">
          <FileText className="size-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No pages available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Pages</h2>
      </header>

      <div className="space-y-5">
        {pageFields.fields.map((_, index) => {
          const templatePage = template.pages.find(
            (p) => p.slug === form.getValues(`pages.${index}.meta.slug`)
          );

          return (
            <div key={index} className="relative group/page-item">
              <FormPageItem
                form={form}
                index={index}
                templatePage={templatePage}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface FormPageItemProps {
  form: UseFormReturn<MicrositeFormInput>;
  index: number;
  templatePage?: ITemplate["pages"][0];
}

const FormPageItem = ({ form, index, templatePage }: FormPageItemProps) => {
  return (
    <div className="w-full relative p-8 space-y-6 bg-background shadow-xs rounded-xl border border-border/50">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Page {index + 1}
          </p>
          <p className="text-sm text-muted-foreground">
            {templatePage?.title ||
              form.getValues(`pages.${index}.meta.title`) ||
              form.getValues(`pages.${index}.name`) ||
              "Page"}
          </p>
        </div>
        <FileText className="size-4 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <FieldGroup>
          <Controller
            name={`pages.${index}.name`}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor={`name-${index}`}
                  className="flex items-center gap-2"
                >
                  Page Name
                </FieldLabel>
                <Input
                  {...field}
                  id={`name-${index}`}
                  aria-invalid={fieldState.invalid}
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
            name={`pages.${index}.meta.slug`}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor={`slug-${index}`}
                  className="flex items-center gap-2"
                >
                  <Lock className="size-3.5" />
                  Page Slug
                </FieldLabel>
                <Input
                  {...field}
                  id={`slug-${index}`}
                  aria-invalid={fieldState.invalid}
                  readOnly
                  className="bg-muted"
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
            name={`pages.${index}.meta.title`}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`meta-title-${index}`}>
                  Meta Title
                </FieldLabel>
                <Input
                  {...field}
                  id={`meta-title-${index}`}
                  aria-invalid={fieldState.invalid}
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
            name={`pages.${index}.meta.description`}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`meta-description-${index}`}>
                  Meta Description
                </FieldLabel>
                <Textarea
                  {...field}
                  id={`meta-description-${index}`}
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

      {templatePage && (
        <FormSection
          form={form}
          fieldArrayName={`pages.${index}.sections`}
          templateSection={templatePage.sections}
        />
      )}
    </div>
  );
};
