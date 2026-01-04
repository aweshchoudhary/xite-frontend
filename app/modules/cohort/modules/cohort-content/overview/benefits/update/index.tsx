"use client";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateSchema, UpdateSchema } from "./schema";
import { toast } from "sonner";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import { MODULE_NAME } from "@/modules/academic-partner/contants";
import { FormBaseProps } from "@/modules/common/components/global/form/types/form-props";
import { updateAction } from "./actions";
import { Plus, Trash, Gift } from "lucide-react";
import ImageSelectorField from "@/modules/common/components/global/form/image-selector-field";
import { Field, FieldError, FieldLabel } from "@ui/field";

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
      toast.error("Error updating benefits section");
    }
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  const benefitsItems = useFieldArray({
    control: form.control,
    name: "benefits_items",
  });

  return (
    <form
      autoComplete="off"
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-8"
    >
      <div className="space-y-6">
        <div>
          <Controller
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  placeholder="Program Benefits"
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
          <div className="flex items-center justify-between mb-4">
            <FieldLabel>Benefits List</FieldLabel>
            <Button
              variant="outline"
              type="button"
              size="sm"
              onClick={() =>
                benefitsItems.append({
                  title: "",
                  description: "",
                  icon_image_url: "",
                })
              }
              className="gap-2"
            >
              <Plus className="size-4" />
              Add Benefit
            </Button>
          </div>

          <div className="space-y-4">
            {benefitsItems.fields.map((field, index) => (
              <div
                key={field.id}
                className="border bg-background border-border rounded-lg p-2"
              >
                <div className="flex gap-4 items-center">
                  <div className="shrink-0">
                    <Controller
                      control={form.control}
                      name={`benefits_items.${index}.icon_image_file`}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <ImageSelectorField
                            form={form}
                            field={field}
                            imageUrlFieldName={`benefits_items.${index}.icon_image_url`}
                            imageFileFieldName={`benefits_items.${index}.icon_image_file`}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>

                  <div className="flex-1 space-y-3">
                    <Controller
                      control={form.control}
                      name={`benefits_items.${index}.title`}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <Input
                            {...field}
                            placeholder="Benefit Title"
                            value={field.value || ""}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>

                  <div className="shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => benefitsItems.remove(index)}
                      type="button"
                    >
                      <Trash className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {benefitsItems.fields.length === 0 && (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                <Gift className="size-8 mx-auto mb-2 opacity-50" />
                <p>No benefits added yet</p>
                <p className="text-sm">
                  Click &quot;Add Benefit&quot; to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button
          variant="outline"
          type="button"
          onClick={handleCancel}
          disabled={form.formState.isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="min-w-[100px]"
        >
          {form.formState.isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Saving...
            </div>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
