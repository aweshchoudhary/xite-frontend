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
} from "@/modules/common/components/ui/form";
import { Input } from "@/modules/common/components/ui/input";
import { Button } from "@/modules/common/components/ui/button";
import { MODULE_NAME } from "@/modules/academic-partner/contants";
import { FormBaseProps } from "@/modules/common/components/global/form/types/form-props";
import { updateAction } from "./actions";
import TextEditor from "@/modules/common/components/global/rich-editor/text-editor";
import { Plus } from "lucide-react";
import { Trash } from "lucide-react";
import MicrositeAdditionalFields from "@/modules/cohort/modules/cohort-content/common/components/microsite-additional-fields-update";
import ImageSelectorField from "@/modules/common/components/global/form/image-selector-field";

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
      toast.error("Error updating testimonials section");
    }
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  const items = useFieldArray({
    control: form.control,
    name: "items",
  });

  return (
    <Form {...form}>
      <form
        autoComplete="off"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8"
      >
        <div>
          <h3 className="h3 font-semibold mb-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Program Testimonials" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </h3>
          <hr />
          <div>
            <h4 className="h4 font-semibold my-5!">Items</h4>
            <div className="space-y-3">
              {items.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-5 p-3 bg-accent/40 rounded-lg"
                >
                  <h5>Testimonial #{index + 1}</h5>
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name={`items.${index}.quote`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <TextEditor
                              formField={field}
                              placeholder="Add the best quote here"
                              defaultValue={
                                field.value ||
                                '<p>"Add the best quote here"</p>'
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <FormField
                        control={form.control}
                        name={`items.${index}.user_image_file`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <ImageSelectorField
                                form={form}
                                field={field}
                                imageUrlFieldName={`items.${index}.user_image_url`}
                                imageFileFieldName={`items.${index}.user_image_file`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex-1 flex gap-5 items-center">
                      <div className="flex-1">
                        <FormField
                          control={form.control}
                          name={`items.${index}.user_name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="User Name"
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex-1">
                        <FormField
                          control={form.control}
                          name={`items.${index}.user_designation`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="User Designation"
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex-1">
                        <FormField
                          control={form.control}
                          name={`items.${index}.user_company`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="User Company"
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button
                      variant="ghost"
                      className="text-destructive"
                      size="sm"
                      onClick={() => items.remove(index)}
                    >
                      <Trash className="size-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="mt-2"
                type="button"
                size="sm"
                onClick={() =>
                  items.append({
                    title: "Testimonial",
                    description: "",
                    quote: "",
                    user_name: "",
                    user_designation: "",
                    user_company: "",
                    user_image_url: "",
                    position: items.fields.length + 1,
                  })
                }
              >
                <Plus className="size-5" />
                Testimonial
              </Button>
            </div>
          </div>

          <MicrositeAdditionalFields
            form={form}
            top_desc_field_name="top_description"
            bottom_desc_field_name="bottom_description"
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
    </Form>
  );
}
