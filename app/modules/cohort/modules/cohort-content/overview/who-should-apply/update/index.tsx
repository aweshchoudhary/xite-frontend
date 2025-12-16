"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateSchema, UpdateSchema } from "./schema";
import { toast } from "sonner";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import { MODULE_NAME } from "@/modules/academic-partner/contants";
import { FormBaseProps } from "@/modules/common/components/global/form/types/form-props";
import { updateAction } from "./actions";
import TextEditor from "@/modules/common/components/global/rich-editor/text-editor";
import MicrositeAdditionalFields from "@/modules/cohort/modules/cohort-content/common/components/microsite-additional-fields-update";
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
    try {
      await updateAction({ data });
      toast.success(`${MODULE_NAME} updated`);
      onSuccess?.();
    } catch (error) {
      toast.error("Error updating description section");
    }
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  return (
    <form
      autoComplete="off"
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-8"
    >
        <div>
          <h3 className="text-lg font-semibold mb-3">
            <Controller
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input placeholder="Title" {...field} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </h3>
          <div>
            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <TextEditor
                    placeholder="Description"
                    defaultValue={field.value}
                    formField={field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </div>

        <MicrositeAdditionalFields
          form={form}
          top_desc_field_name="top_description"
          bottom_desc_field_name="bottom_description"
        />

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
