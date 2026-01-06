"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateSchema, UpdateSchema } from "./schema";
import { toast } from "sonner";
import { Input } from "@ui/input";
import { FormBaseProps } from "@/modules/common/components/global/form/types/form-props";
import { updateAction } from "./actions";
import { Button } from "@ui/button";
import { Label } from "@ui/label";
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
      toast.success(`Industry Experts section updated`);
      onSuccess?.();
    } catch (error) {
      toast.error("Error updating Industry Experts section");
    }
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  return (
    <div>
      <Label className="mb-3">Section Title</Label>
      <form
        autoComplete="off"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex items-center gap-2"
      >
          <div>
            <h3 className="text-2xl font-semibold text-foreground">
              <Controller
                control={form.control}
                name="title"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Input placeholder="Section Title" type="text" {...field} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </h3>
          </div>

          <footer className="flex justify-end gap-2">
            <Button type="submit" size="sm">
              {form.formState.isSubmitting ? "Saving.." : "Save"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </footer>
      </form>
    </div>
  );
}
