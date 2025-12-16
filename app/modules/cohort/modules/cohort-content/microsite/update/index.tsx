"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateSchema, UpdateSchema } from "./schema";
import { toast } from "sonner";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import { FormBaseProps } from "@/modules/common/components/global/form/types/form-props";
import { updateAction } from "./actions";
import { DatePickerField } from "@/modules/common/components/global/form/date-form-field";
import DraggableList from "./sort-sections";
import { Field, FieldDescription, FieldError, FieldLabel } from "@ui/field";

interface CreateFormProps extends FormBaseProps<UpdateSchema> {}

export default function CreateForm({
  defaultValues,
  onSuccess,
  onCancel,
}: CreateFormProps) {
  const form = useForm({
    resolver: zodResolver(updateSchema),
    defaultValues: defaultValues as UpdateSchema,
  });

  const handleSubmit = async (data: UpdateSchema) => {
    toast.promise(updateAction({ data }), {
      loading: "Updating microsite section...",
      success: "Microsite section updated",
      error: "Error updating microsite section",
    });
    onSuccess?.();
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  return (
    <form
      autoComplete="off"
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-5"
    >
        <div className="grid xl:grid-cols-2 gap-6">
          <div>
            <FieldLabel className="mb-3">Visibility</FieldLabel>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Controller
                  control={form.control}
                  name="visibility_start_date"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <DatePickerField formField={field} />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
              <div>:</div>

              <div className="flex-1">
                <Controller
                  control={form.control}
                  name="visibility_end_date"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <DatePickerField formField={field} />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </div>
          </div>
          <div>
            <Controller
              control={form.control}
              name="custom_domain"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="mb-3">Custom Domain</FieldLabel>
                  <Input
                    placeholder="https://example.com"
                    {...field}
                    value={field.value ?? ""}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </div>

        <div>
          <DraggableList
            items={
              defaultValues?.sections?.sort(
                (a, b) => a.section_position - b.section_position
              ) || []
            }
            onReorder={(data: any) => {
              form.setValue("sections", data);
            }}
          />
        </div>
        <footer className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {form.formState.isSubmitting ? "Saving..." : "Save"}
          </Button>
        </footer>
    </form>
  );
}
