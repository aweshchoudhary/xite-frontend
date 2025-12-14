"use client";
import { Controller, Form, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateSchema, UpdateSchema } from "./schema";
import { toast } from "sonner";
import { Input } from "@/modules/common/components/ui/input";
import { Button } from "@/modules/common/components/ui/button";
import { FormBaseProps } from "@/modules/common/components/global/form/types/form-props";
import { updateAction } from "./actions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/modules/common/components/ui/popover";
import { HexColorPicker } from "react-colorful";
import { readableColor } from "polished";
import FormColorPicker from "@/modules/common/components/global/form/form-color-picker";
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
    toast.promise(updateAction({ data }), {
      loading: "Updating cohort branding...",
      success: "Cohort branding updated",
      error: "Error updating cohort branding",
    });
    onSuccess?.();
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  return (
    <Form {...form}>
      <form
        autoComplete="off"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8"
      >
        <div className="grid xl:grid-cols-1 gap-4">
          <div>
            <Controller
              control={form.control}
              name="font_name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="mb-3">Font Name</FieldLabel>
                  <Input
                    placeholder="Arial, Helvetica, sans-serif"
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
          <div>
            <Controller
              control={form.control}
              name="default_border_radius"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="mb-3">Border Radius (px)</FieldLabel>
                  <Input
                    placeholder="0"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      field.onChange(Number(e.target.value) || 0);
                    }}
                    min={0}
                    type="number"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div>
            <FieldLabel className="mb-3">Colors</FieldLabel>
            <div className="flex flex-wrap gap-4">
              <FormColorPicker
                form={form}
                textColorName="background_color.text_color"
                backgroundColorName="background_color.background_color"
                label="Background Color"
              />
              <FormColorPicker
                form={form}
                textColorName="primary_color.text_color"
                backgroundColorName="primary_color.background_color"
                label="Primary Color"
              />
              <FormColorPicker
                form={form}
                textColorName="secondary_color.text_color"
                backgroundColorName="secondary_color.background_color"
                label="Secondary Color"
              />
            </div>
          </div>
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
    </Form>
  );
}
