"use client";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateSchema, UpdateSchema } from "./schema";
import { toast } from "sonner";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Form,
  FormLabel,
} from "@/modules/common/components/ui/form";
import { Input } from "@/modules/common/components/ui/input";
import { Button } from "@/modules/common/components/ui/button";
import { MODULE_NAME } from "@/modules/academic-partner/contants";
import { FormBaseProps } from "@/modules/common/components/global/form/types/form-props";
import { updateAction } from "./actions";
import { Plus, Trash, Gift } from "lucide-react";
import ImageSelectorField from "@/modules/common/components/global/form/image-selector-field";
import MicrositeAdditionalFields from "../../../common/components/microsite-additional-fields-update";

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
    <Form {...form}>
      <form
        autoComplete="off"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8"
      >
        <div className="space-y-6">
          <div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Program Benefits"
                      {...field}
                      className="text-lg font-medium"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <FormLabel>Benefits List</FormLabel>
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
                      <FormField
                        control={form.control}
                        name={`benefits_items.${index}.icon_image_file`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <ImageSelectorField
                                form={form}
                                field={field}
                                imageUrlFieldName={`benefits_items.${index}.icon_image_url`}
                                imageFileFieldName={`benefits_items.${index}.icon_image_file`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex-1 space-y-3">
                      <FormField
                        control={form.control}
                        name={`benefits_items.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Benefit Title"
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="shrink-0">
                      <Button
                        variant="ghost"
                        size="iconSm"
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

              <MicrositeAdditionalFields
                form={form}
                top_desc_field_name="top_description"
                bottom_desc_field_name="bottom_description"
              />

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
    </Form>
  );
}
