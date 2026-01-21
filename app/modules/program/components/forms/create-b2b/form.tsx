"use client";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSchema, CreateSchema } from "./schema";
import { createProgramAction } from "./action";
import { toast } from "sonner";
import { useFormState } from "./context";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import { useMemo } from "react";
import { FormBaseProps } from "@/modules/common/components/global/form/types/form-props";
import { useRouter } from "next/navigation";
import { Field, FieldError, FieldLabel } from "@ui/field";
import { getRequiredFields } from "@/modules/common/lib/zod-required-field-checker";
import slugify from "slugify";
import { DatePickerField } from "@/modules/common/components/global/form/date-form-field";
import TextEditor from "@/modules/common/components/global/rich-editor/text-editor";
import Curriculum from "./curriculum";

type CreateFormProps = FormBaseProps<CreateSchema>;

export default function CreateForm({
  cancelRedirectPath,
  successRedirectPath,
  defaultValues,
}: CreateFormProps) {
  const form = useForm({
    resolver: zodResolver(createSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const { closeModal, redirect } = useFormState();
  const router = useRouter();

  const requiredFields = useMemo(
    () => getRequiredFields(createSchema),
    []
  );

  const handleSubmit = async (data: CreateSchema) => {
    toast.promise(submitHandler(data), {
      loading: "Creating program...",
      success: "Program created successfully",
      error: "Failed to create program",
    });
  };

  const submitHandler = async (data: CreateSchema) => {
    await createProgramAction(data);
    redirect(router, successRedirectPath);
    closeModal();
  };

  const handleCancel = () => {
    redirect(router, cancelRedirectPath);
    closeModal();
  };

  const tags = useWatch({ control: form.control, name: "tags" }) || [];

  const addTag = () => {
    const input = document.getElementById("tag-input") as HTMLInputElement;
    const value = input?.value?.trim();
    if (value && !tags.includes(value)) {
      form.setValue("tags", [...tags, value]);
      input.value = "";
    }
  };

  const removeTag = (tag: string) => {
    form.setValue(
      "tags",
      tags.filter((t) => t !== tag)
    );
  };

  return (
    <form
      autoComplete="off"
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-8"
    >
      <div>
        <h2 className="text-sm text-muted-foreground mb-5">Program Details</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Controller
            control={form.control}
            name="program_name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel isRequired={requiredFields.includes("program_name")}>
                  Name
                </FieldLabel>
                <Input {...field} onChange={(e) => {
                  field.onChange(e);
                  form.setValue("program_key", slugify(e.target.value, { lower: true }));
                }} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div>
          <Controller
            control={form.control}
            name="program_short_name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel isRequired={requiredFields.includes("program_short_name")}>
                  Short Name
                </FieldLabel>
                <Input {...field} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div>
          <Controller
            control={form.control}
            name="program_key"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel isRequired={requiredFields.includes("program_key")}>
                  Program Key
                </FieldLabel>
                <Input {...field} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </div>
      </div>
      <hr />
      <div>
        <h2 className="text-sm text-muted-foreground mb-5">Cohort Details</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Controller
            control={form.control}
            name="cohort_start_date"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel isRequired={requiredFields.includes("cohort_start_date")}>
                  Start Date
                </FieldLabel>
                <DatePickerField formField={field}/>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div>
          <Controller
            control={form.control}
            name="cohort_end_date"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel isRequired={requiredFields.includes("cohort_end_date")}>
                  End Date
                </FieldLabel>
                <DatePickerField formField={field}/>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div>
          <Controller
            control={form.control}
            name="cohort_format"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel isRequired={requiredFields.includes("cohort_format")}>
                  Format
                </FieldLabel>
                <Input {...field} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div>
          <Controller
            control={form.control}
            name="cohort_duration"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel isRequired={requiredFields.includes("cohort_duration")}>
                  Duration
                </FieldLabel>
                <Input {...field} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div>
          <Controller
            control={form.control}
            name="cohort_location"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel isRequired={requiredFields.includes("cohort_location")}>
                  Location
                </FieldLabel>
                <Input {...field} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </div>
      </div>

      <hr />

      <div>
      <div>
          <Controller
            control={form.control}
            name="overview_description"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel isRequired={requiredFields.includes("overview_description")}>
                  Overview Description
                </FieldLabel>
                <TextEditor placeholder="Overview Description" formField={field} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </div>

      <div>
        <Curriculum form={form} />
      </div>

      <footer className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {form.formState.isSubmitting ? "Creating..." : "Create"}
        </Button>
      </footer>
    </form>
  );
}
