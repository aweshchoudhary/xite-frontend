"use client";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateSchema, UpdateSchema } from "./schema";
import { toast } from "sonner";
import {
  FormField,
  FormItem,
  FormLabel,
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
import { Plus, Trash } from "lucide-react";
import { Separator } from "@/modules/common/components/ui/separator";
import ImageSelectorField from "@/modules/common/components/global/form/image-selector-field";
import MicrositeAdditionalFields from "@/modules/cohort/modules/cohort-content/common/components/microsite-additional-fields-update";

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
      toast.error("Error updating certification section");
    }
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  const industryItems = useFieldArray({
    control: form.control,
    name: "industry_item.data_list.items",
  });

  const designationItems = useFieldArray({
    control: form.control,
    name: "designation_item.data_list.items",
  });

  return (
    <Form {...form}>
      <form
        autoComplete="off"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8"
      >
        <div>
          <h3 className="text-lg font-semibold">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </h3>
        </div>
        <hr />
        <div className="space-y-5 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-5">
          <div className="space-y-3 p-3 border rounded-lg">
            <h3 className="text-lg font-semibold">
              <FormField
                control={form.control}
                name="work_experience_item.title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </h3>
            <div>
              <div className="col-span-2 cursor-pointer!">
                <FormField
                  control={form.control}
                  name="work_experience_item.chart_image_file"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div>
                          <ImageSelectorField
                            form={form}
                            field={field}
                            imageUrlFieldName="work_experience_item.chart_image_url"
                            imageFileFieldName="work_experience_item.chart_image_file"
                            className="h-auto! aspect-video w-full rounded-lg! overflow-hidden"
                            imageClassName="size-full object-cover rounded-none!"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div>
              <FormField
                control={form.control}
                name="work_experience_item.description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TextEditor
                        placeholder="Description"
                        defaultValue={field.value}
                        formField={field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="space-y-3 p-3 border rounded-lg">
            <h3 className="text-lg font-semibold">
              <FormField
                control={form.control}
                name="industry_item.title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Title"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          form.setValue(
                            "industry_item.data_list.title",
                            e.target.value
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </h3>
            <Separator />
            <div className="space-y-2">
              <div>
                <FormLabel>Industries List</FormLabel>
              </div>
              {industryItems.fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name={`industry_item.data_list.items.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Industry Title"
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <Button
                      variant="ghost"
                      size="iconSm"
                      className="text-destructive"
                      onClick={() => industryItems.remove(index)}
                    >
                      <Trash className="size-4" />
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
                  industryItems.append({
                    title: "",
                    description: "",
                  })
                }
              >
                <Plus className="size-5" />
                Add Industry
              </Button>
            </div>
          </div>
          <div className="space-y-3 p-3 border rounded-lg">
            <h3 className="text-lg font-semibold">
              <FormField
                control={form.control}
                name="designation_item.title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Title"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          form.setValue(
                            "designation_item.data_list.title",
                            e.target.value
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </h3>
            <Separator />
            <div className="space-y-2">
              <div>
                <FormLabel>Designations List</FormLabel>
              </div>
              {designationItems.fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name={`designation_item.data_list.items.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Designation Title"
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <Button
                      variant="ghost"
                      size="iconSm"
                      className="text-destructive"
                      onClick={() => designationItems.remove(index)}
                    >
                      <Trash className="size-4" />
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
                  designationItems.append({
                    title: "",
                    description: "",
                  })
                }
              >
                <Plus className="size-5" />
                Add Designation
              </Button>
            </div>
          </div>
          <div className="space-y-3 p-3 border rounded-lg">
            <h3 className="text-lg font-semibold">
              <FormField
                control={form.control}
                name="company_item.title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </h3>
            <div>
              <div className="col-span-2 cursor-pointer!">
                <FormField
                  control={form.control}
                  name="company_item.image_file"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <ImageSelectorField
                            form={form}
                            field={field}
                            imageUrlFieldName="company_item.image_url"
                            imageFileFieldName="company_item.image_file"
                            className="h-auto! aspect-video w-full rounded-lg! overflow-hidden"
                            imageClassName="size-full object-cover rounded-none!"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
