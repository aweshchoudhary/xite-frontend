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
import MicrositeAdditionalFields from "../../../common/components/microsite-additional-fields-update";
import { Field, FieldDescription, FieldError, FieldLabel } from "@ui/field";

type CreateFormProps = FormBaseProps<UpdateSchema>;

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
      toast.error("Error updating overview section");
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
      className="space-y-5"
    >
      <div className="space-y-2">
        <div>
          <Controller
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  placeholder="Section Title: Program Overview"
                  {...field}
                  className="text-lg font-medium"
                />
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
            name="description"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div>
                  <TextEditor
                    placeholder="Add a comprehensive overview of your program..."
                    formField={field}
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <MicrositeAdditionalFields
          form={form}
          top_desc_field_name="top_description"
          bottom_desc_field_name="bottom_description"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          type="button"
          onClick={handleCancel}
          disabled={form.formState.isSubmitting}
          size={"sm"}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          size={"sm"}
        >
          {form.formState.isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Saving...
            </div>
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </form>
  );
}
