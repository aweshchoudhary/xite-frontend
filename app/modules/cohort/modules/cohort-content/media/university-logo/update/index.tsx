"use client";
import { Controller, Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateSchema, UpdateSchema } from "./schema";
import { toast } from "sonner";
import { Input } from "@/modules/common/components/ui/input";
import { Button } from "@/modules/common/components/ui/button";
import { MODULE_NAME } from "@/modules/academic-partner/contants";
import { FormBaseProps } from "@/modules/common/components/global/form/types/form-props";
import { updateAction } from "./actions";
import ImageSelectorField from "@/modules/common/components/global/form/image-selector-field";
import { Separator } from "@/modules/common/components/ui/separator";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/modules/common/components/ui/field";

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
      toast.error("Error updating overview section");
    }
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex items-center gap-2">
          <div>
            <Controller
              control={form.control}
              name="university_logo_file"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <ImageSelectorField
                    form={form}
                    field={field}
                    imageUrlFieldName="university_logo_url"
                    imageFileFieldName="university_logo_file"
                    className="size-30 mb-5 rounded-md"
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
              name="university_logo_width"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    placeholder="University Logo Width"
                    type="number"
                    {...field}
                    onChange={(e) => {
                      field.onChange(Number(e.target.value));
                    }}
                    className="w-fit text-sm"
                    value={field?.value?.toString() ?? ""}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </div>
        <Separator className="mb-2" />
        <footer className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm">
            {form.formState.isSubmitting ? "Saving..." : "Save"}
          </Button>
        </footer>
      </form>
    </Form>
  );
}
